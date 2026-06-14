import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShareLink } from "@/components/ShareLink";
import { SuggestionForm } from "@/components/SuggestionForm";
import { VoteForm } from "@/components/VoteForm";
import { getEventById } from "@/lib/data/events";
import { getEventSearchCode } from "@/lib/eventSearch";
import type { VoteChoice } from "@/lib/types";
import { getVoteCounts } from "@/lib/utils";
import { validateUuid } from "@/lib/validation";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const voteLabels: Record<VoteChoice, string> = {
  yes: "Ja",
  maybe: "Kanske",
  no: "Nej"
};

export const metadata: Metadata = {
  title: "Spika-planering",
  description: "Visa och rösta i en privat Spika-planering."
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

  return `${formatShortDate(suggestion.date)}${time ? ` kl. ${time}` : ""}`;
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
  const eventSearchCode = getEventSearchCode(event.id, event.search_code);
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

  return (
    <section className="page-frame grid gap-5 sm:gap-6">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_minmax(19rem,0.64fr)] lg:items-start">
        <div className="grid gap-3">
          <h1 className="text-2xl font-extrabold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl">
            {event.title}
          </h1>
          {event.description ? (
            <p className="max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]/80 sm:text-base sm:leading-7">
              {event.description}
            </p>
          ) : null}
          {creatorSuggestion ? (
            <p className="ui-note text-sm font-semibold sm:w-fit">
              Skaparens förslag från {creatorSuggestion.suggested_by}:{" "}
              {formatDate(creatorSuggestion.date)}
              {creatorSuggestionTime ? ` kl. ${creatorSuggestionTime}` : ""}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3">
          <ShareLink path={`/event/${event.id}`} searchCode={eventSearchCode} />
          <p className="ui-note text-xs font-medium leading-5 text-[var(--foreground)]/78">
            Alla med länken kan se detaljer, namn, datumförslag och röster.
          </p>
        </div>
      </div>

      {suggestionSummaries.length ? (
        <section className="ui-panel grid gap-3 p-3 sm:p-4">
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

          <div className="grid gap-2">
            {suggestionSummaries.map(({ suggestion, counts, label }) => {
              const yesWidth = Math.max(
                counts.yes > 0 ? 10 : 0,
                Math.round((counts.yes / maxYesVotes) * 100)
              );

              return (
                <div
                  className="grid gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/65 px-2.5 py-2 sm:grid-cols-[minmax(8rem,0.7fr)_1fr_auto] sm:items-center sm:px-3"
                  key={suggestion.id}
                >
                  <div>
                    <p className="font-extrabold text-[var(--foreground)]">{label}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Föreslaget av {suggestion.suggested_by}
                    </p>
                  </div>
                  <div
                    aria-label={`${counts.yes} ja-röster för ${label}`}
                    className="h-2.5 overflow-hidden rounded-full bg-[var(--stone)]"
                  >
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${yesWidth}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-[var(--muted)]">
                    {counts.yes} ja · {counts.maybe} kanske · {counts.no} nej
                  </p>
                </div>
              );
            })}
          </div>
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
                  className="ui-panel grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.46fr)] lg:items-start"
                >
                  <div className="grid gap-1.5">
                    <div>
                      <h3 className="text-lg font-extrabold tracking-[-0.035em] text-[var(--foreground)] sm:text-xl">
                        {formatDate(suggestion.date)}
                      </h3>
                      {time ? (
                        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                          {time}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--muted)] sm:text-sm">
                      Föreslaget av {suggestion.suggested_by}
                    </p>

                    <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-[var(--muted)] sm:text-sm">
                      <span>{counts.yes} ja</span>
                      <span>{counts.maybe} kanske</span>
                      <span>{counts.no} nej</span>
                    </p>

                    {suggestion.votes.length ? (
                      <div className="grid gap-1 text-xs text-[var(--muted)] sm:text-sm">
                        <h4 className="font-extrabold uppercase tracking-[0.1em] text-[var(--foreground)]">
                          Röster
                        </h4>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1">
                          {suggestion.votes.map((vote) => (
                            <li key={vote.id}>
                              {vote.voter_name}: {voteLabels[vote.choice]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--muted)]">Inga röster än.</p>
                    )}
                  </div>

                  <VoteForm eventId={event.id} suggestionId={suggestion.id} />
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

      <SuggestionForm eventId={event.id} />
    </section>
  );
}
