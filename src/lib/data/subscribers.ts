import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { eventSubscribers, events } from "@/db/schema";
import {
  getValidatedValue,
  validateNotificationInterval,
  validateRequiredEmail,
  validateUuid
} from "@/lib/validation";

function throwDataError(action: string, error: unknown): never {
  console.error(`Database error while ${action}.`, {
    message: error instanceof Error ? error.message : String(error)
  });

  throw new Error("Något gick fel när aviseringen skulle sparas.");
}

export async function subscribeToEventNotifications(input: {
  eventId: string;
  email: string;
  intervalHours: string;
}): Promise<void> {
  const eventId = getValidatedValue(validateUuid(input.eventId, "Planerings-ID"));
  const email = getValidatedValue(validateRequiredEmail(input.email));
  const intervalHours = getValidatedValue(
    validateNotificationInterval(input.intervalHours)
  );

  try {
    const [event] = await getDb()
      .select({ id: events.id })
      .from(events)
      .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
      .limit(1);

    if (!event) {
      throw new Error("Planeringen hittades inte.");
    }

    await getDb()
      .insert(eventSubscribers)
      .values({ eventId, email, intervalHours })
      .onConflictDoUpdate({
        target: [eventSubscribers.eventId, eventSubscribers.email],
        set: {
          intervalHours,
          lastDigestAt: sql`now()`,
          lastSeenActivityAt: sql`now()`
        }
      });
  } catch (error) {
    throwDataError("subscribing to event notifications", error);
  }
}

export async function unsubscribeFromEventNotifications(
  subscriptionId: string
): Promise<void> {
  const id = getValidatedValue(
    validateUuid(subscriptionId, "Prenumerations-ID")
  );

  try {
    await getDb()
      .delete(eventSubscribers)
      .where(eq(eventSubscribers.id, id));
  } catch (error) {
    throwDataError("unsubscribing from event notifications", error);
  }
}
