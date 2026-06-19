import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandHeader } from "@/components/BrandHeader";
import { NotificationSignupForm } from "@/components/NotificationSignupForm";
import { ShareLink } from "@/components/ShareLink";
import { SuggestionForm } from "@/components/SuggestionForm";
import { VoteSummaryAccordion } from "@/components/VoteSummaryAccordion";
import { VoteForm } from "@/components/VoteForm";
import { getEventById } from "@/lib/data/events";
import { getEventSearchCode } from "@/lib/eventSearch";
import { getVoteCounts } from "@/lib/utils";
import { validateUuid } from "@/lib/validation";
import {
  formatVotingDeadline,
  isVotingClosed
} from "@/lib/votingDeadline";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "PickADay-planering",
  description: "Visa och rösta i en privat PickADay-planering."
};

function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "full",
    timeZone: "UTC"
  }).format(parsedDate);
}

function formatTime(time: string | null): string | null {
  return time ? time.slice(0, 5) : null;
}

function getIsoWeekNumber(date: string): number | null {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) return null;

  parsedDate.setUTCDate(
    parsedDate.getUTCDate() + 4 - (parsedDate.getUTCDay() || 7)
  );
  const yearStart = new Date(Date.UTC(parsedDate.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((parsedDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}

function formatWeek(date: string): string {
  const week = getIsoWeekNumber(date);
  return week ? `vecka ${week}` : "";
}

function formatShortDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    weekday: "short",
    timeZone: "UTC"
  }).format(parsedDate);
}

function getCreatorSuggestion(
  suggestions: NonNullable<Awaited<ReturnType<typeof getEventById>>>["suggestions"]
) {
  return suggestions.reduce<(typeof suggestions)[number] | null>(
    (earliest, suggestion) => {
      if (!earliest) {
        return suggestion;
      }

      return suggestion.created_at.getTime() < earliest.created_at.getTime()
        ? suggestion
        : earliest;
    },
    null
  );
}

function getSuggestionLabel(
  suggestion: NonNullable<Awaited<ReturnType<typeof getEventById>>>["suggestions"][number]
): string {
  const time = formatTime(suggestion.time);

  return `${formatShortDate(suggestion.date)} (${formatWeek(suggestion.date)})${time ? ` kl. ${time}` : ""}`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const idValidation = validateUuid(id, "Planerings-ID");

  if (!idValidation.ok) {
    notFound();
  }

  const event = await getEventById(idValidation.value);

  if (!event) {
    notFound();
  }

  const creatorSuggestion = getCreatorSuggestion(event.suggestions);
  const creatorSuggestionTime = creatorSuggestion
    ? formatTime(creatorSuggestion.time)
    : null;
  const eventSearchCode = getEventSearchCode(event.search_code);
  const votingClosed = isVotingClosed(event.voting_closes_at);
  const suggestionSummaries = event.suggestions.map((suggestion) => ({
    suggestion,
    counts: getVoteCounts(suggestion.votes),
    label: getSuggestionLabel(suggestion)
  }));
  const maxYesVotes = Math.max(
    1,
    ...suggestionSummaries.map(({ counts }) => counts.yes)
  );
  const totalYesVotes = suggestionSummaries.reduce(
    (total, { counts }) => total + counts.yes,
    0
  );
  const leadingSuggestion = totalYesVotes > 0
    ? suggestionSummaries.find(({ counts }) => counts.yes === maxYesVotes)
    : null;
  const voteSummaryItems = suggestionSummaries.map(({ suggestion, counts, label }) => ({
    id: suggestion.id,
    label,
    counts,
    votes: suggestion.votes
  }));

  return (
    <section className="page-frame grid gap-5 sm:gap-6">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_minmax(19rem,0.64fr)] lg:items-start">
        <BrandHeader
          className="mb-1 sm:mb-2"
          logoClassName="w-[21rem] sm:w-[26rem] lg:w-[28rem]"
        />

        <ShareLink path={`/event/${event.id}`} searchCode={eventSearchCode} />

        <div className="grid gap-3">
          <h1 className="text-2xl font-extrabold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl">
            {event.title}
          </h1>
          {event.description ? (
            <p className="max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]/80 sm:text-base sm:leading-7">
              {event.description}
            </p>
          ) : null}
          <div className="grid gap-1 sm:w-fit">
            {creatorSuggestion ? (
              <p className="ui-note text-sm font-semibold">
                Skapat av {creatorSuggestion.suggested_by}:{" "}
                {formatDate(creatorSuggestion.date)}
                {` (${formatWeek(creatorSuggestion.date)})`}
                {creatorSuggestionTime ? ` kl. ${creatorSuggestionTime}` : ""}
              </p>
            ) : null}
            {event.voting_closes_at ? (
              <p className="ui-note text-sm font-semibold">
                Röstningen stänger{" "}
                {formatVotingDeadline(event.voting_closes_at)}
              </p>
            ) : null}
          </div>
        </div>

        <aside
          aria-label="Information och aviseringar"
          className="grid gap-3"
        >
          <p className="ui-note text-xs font-medium leading-5 text-[var(--foreground)]/78">
            Alla med länken kan se detaljer, namn, datumförslag och röster.
          </p>
          <NotificationSignupForm eventId={event.id} />
        </aside>
      </div>

      {suggestionSummaries.length ? (
        <section className="ui-panel grid gap-3 p-2.5 sm:p-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-2xl">
                Röstläge
              </h2>
              <p className="ui-field-copy">
                En lugn överblick över vilka tider som fungerar bäst.
              </p>
            </div>
            {leadingSuggestion ? (
              <p className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-extrabold text-[var(--accent-foreground)] sm:text-sm">
                Leder: {leadingSuggestion.label}
              </p>
            ) : (
              <p className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-extrabold text-[var(--muted)] sm:text-sm">
                Inga ja-röster än
              </p>
            )}
          </div>

          <VoteSummaryAccordion items={voteSummaryItems} />
        </section>
      ) : null}

      <div className="grid gap-3">
        <h2 className="text-lg font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-2xl">
          Datumförslag
        </h2>

        {event.suggestions.length ? (
          <div className="grid gap-2.5 sm:gap-3">
            {event.suggestions.map((suggestion) => {
              const counts = getVoteCounts(suggestion.votes);
              const time = formatTime(suggestion.time);

              return (
                <article
                  key={suggestion.id}
                  className="ui-panel grid gap-2.5 p-2.5 sm:p-3 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.42fr)] lg:items-start"
                >
                  <div className="grid gap-1">
                    <div className="grid gap-0.5">
                      <h3 className="text-base font-extrabold tracking-[-0.03em] text-[var(--foreground)] sm:text-lg">
                        {formatDate(suggestion.date)} ({formatWeek(suggestion.date)})
                      </h3>
                      {time ? (
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                          {time}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                      Föreslaget av {suggestion.suggested_by}
                    </p>

                    <p className="flex flex-wrap gap-x-2.5 gap-y-1 text-xs font-bold text-[var(--muted)] sm:text-sm">
                      <span>{counts.yes} ja</span>
                      <span>{counts.maybe} kanske</span>
                      <span>{counts.no} nej</span>
                      <span>{suggestion.votes.length} totalt</span>
                    </p>
                  </div>

                  {votingClosed ? (
                    <p className="ui-note text-sm font-semibold">
                      Röstningen är stängd.
                    </p>
                  ) : (
                    <VoteForm eventId={event.id} suggestionId={suggestion.id} />
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="ui-panel p-5 text-[var(--muted)]">
            Inga datumförslag än. Lägg till det första alternativet nedan.
          </p>
        )}
      </div>

      {votingClosed ? (
        <p className="ui-panel p-4 text-sm font-semibold">
          Röstningen är stängd.
        </p>
      ) : (
        <SuggestionForm eventId={event.id} />
      )}
    </section>
  );
}
