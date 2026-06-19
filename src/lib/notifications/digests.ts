import type { EventWithSuggestions } from "@/lib/data/events";

export type DueSubscription = {
  id: string;
  eventId: string;
  email: string;
  intervalHours: number;
  lastDigestAt: Date;
  lastSeenActivityAt: Date;
  activityAt: Date;
};

type DigestDependencies = {
  getEvent: (id: string) => Promise<EventWithSuggestions | null>;
  sendEmail: (input: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) => Promise<boolean>;
  updateTimestamps: (input: {
    id: string;
    lastDigestAt: Date;
    lastSeenActivityAt: Date;
  }) => Promise<void>;
  now: () => Date;
  absoluteUrl: (path: string) => string | null;
};

const labels = { yes: "Ja", maybe: "Kanske", no: "Nej" } as const;

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]!
  );
}

export function isDigestDue(
  subscription: DueSubscription,
  now = new Date()
): boolean {
  return (
    subscription.activityAt > subscription.lastSeenActivityAt &&
    subscription.lastDigestAt.getTime() +
      subscription.intervalHours * 60 * 60 * 1000 <=
      now.getTime()
  );
}

export function buildNotificationDigest(
  event: EventWithSuggestions,
  eventUrl: string,
  unsubscribeUrl: string
): { subject: string; text: string; html: string } {
  const subject = `Uppdatering: ${event.title}`;
  const textSuggestions = event.suggestions.map((suggestion) => {
    const votes = (["yes", "maybe", "no"] as const).map((choice) => {
      const names = suggestion.votes
        .filter((vote) => vote.choice === choice)
        .map((vote) => vote.voter_name);
      return `${labels[choice]} (${names.length}): ${names.join(", ") || "-"}`;
    });
    return [
      `${suggestion.date}${suggestion.time ? ` ${suggestion.time.slice(0, 5)}` : ""} — ${suggestion.suggested_by}`,
      ...votes
    ].join("\n");
  });
  const htmlSuggestions = event.suggestions
    .map((suggestion) => {
      const votes = (["yes", "maybe", "no"] as const)
        .map((choice) => {
          const names = suggestion.votes
            .filter((vote) => vote.choice === choice)
            .map((vote) => escapeHtml(vote.voter_name));
          return `<li><strong>${labels[choice]} (${names.length}):</strong> ${names.join(", ") || "-"}</li>`;
        })
        .join("");
      return `<li><p><strong>${escapeHtml(suggestion.date)}${suggestion.time ? ` ${escapeHtml(suggestion.time.slice(0, 5))}` : ""}</strong> — ${escapeHtml(suggestion.suggested_by)}</p><ul>${votes}</ul></li>`;
    })
    .join("");

  return {
    subject,
    text: [
      event.title,
      "",
      ...textSuggestions,
      "",
      `Öppna planeringen: ${eventUrl}`,
      `Avsluta aviseringar: ${unsubscribeUrl}`
    ].join("\n"),
    html: `<h1>${escapeHtml(event.title)}</h1><ul>${htmlSuggestions}</ul><p><a href="${escapeHtml(eventUrl)}">Öppna planeringen</a></p><p><a href="${escapeHtml(unsubscribeUrl)}">Avsluta aviseringar</a></p>`
  };
}

export async function processDueSubscription(
  subscription: DueSubscription,
  dependencies: DigestDependencies
): Promise<boolean> {
  const event = await dependencies.getEvent(subscription.eventId);
  const eventUrl = dependencies.absoluteUrl(`/event/${subscription.eventId}`);
  const unsubscribeUrl = dependencies.absoluteUrl(
    `/notifications/unsubscribe/${subscription.id}`
  );
  if (!event || !eventUrl || !unsubscribeUrl) return false;

  const digest = buildNotificationDigest(event, eventUrl, unsubscribeUrl);
  const sent = await dependencies.sendEmail({
    to: subscription.email,
    ...digest
  });
  if (!sent) return false;

  await dependencies.updateTimestamps({
    id: subscription.id,
    lastDigestAt: dependencies.now(),
    lastSeenActivityAt: subscription.activityAt
  });
  return true;
}

export async function sendDueNotificationDigests(): Promise<{
  attempted: number;
  sent: number;
}> {
  const [{ and, eq, isNotNull, isNull, sql }, { getDb }, schema, eventsData, email] =
    await Promise.all([
      import("drizzle-orm"),
      import("@/db"),
      import("@/db/schema"),
      import("@/lib/data/events"),
      import("./email")
    ]);
  const db = getDb();
  const due = await db
    .select({
      id: schema.eventSubscribers.id,
      eventId: schema.eventSubscribers.eventId,
      email: schema.eventSubscribers.email,
      intervalHours: schema.eventSubscribers.intervalHours,
      lastDigestAt: schema.eventSubscribers.lastDigestAt,
      lastSeenActivityAt: schema.eventSubscribers.lastSeenActivityAt,
      activityAt: schema.events.notificationActivityAt
    })
    .from(schema.eventSubscribers)
    .innerJoin(schema.events, eq(schema.events.id, schema.eventSubscribers.eventId))
    .where(
      and(
        isNull(schema.events.deletedAt),
        isNotNull(schema.events.notificationActivityAt),
        sql`${schema.events.notificationActivityAt} > ${schema.eventSubscribers.lastSeenActivityAt}`,
        sql`${schema.eventSubscribers.lastDigestAt} + (${schema.eventSubscribers.intervalHours} * interval '1 hour') <= now()`
      )
    );

  let sent = 0;
  for (const row of due) {
    if (
      await processDueSubscription(row as DueSubscription, {
        getEvent: eventsData.getEventById,
        sendEmail: email.sendNotificationEmail,
        absoluteUrl: email.getAbsoluteUrl,
        now: () => new Date(),
        updateTimestamps: async (timestamps) => {
          await db
            .update(schema.eventSubscribers)
            .set({
              lastDigestAt: timestamps.lastDigestAt,
              lastSeenActivityAt: timestamps.lastSeenActivityAt
            })
            .where(eq(schema.eventSubscribers.id, timestamps.id));
        }
      })
    ) {
      sent += 1;
    }
  }

  return { attempted: due.length, sent };
}
