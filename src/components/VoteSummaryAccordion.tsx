import type { VoteChoice, VoteRecord } from "@/lib/types";

type SummaryCounts = {
  yes: number;
  maybe: number;
  no: number;
};

type SummaryItem = {
  id: string;
  label: string;
  counts: SummaryCounts;
  votes: VoteRecord[];
};

type VoteSummaryAccordionProps = {
  items: SummaryItem[];
};

const choiceLabels: Record<VoteChoice, string> = {
  yes: "Ja",
  maybe: "Kanske",
  no: "Nej"
};

const choiceBarClasses: Record<VoteChoice, string> = {
  yes: "bg-[var(--accent)]",
  maybe: "bg-[var(--rose)]",
  no: "bg-[var(--stone)]"
};

const choiceChipClasses: Record<VoteChoice, string> = {
  yes: "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]",
  maybe: "border-[var(--rose)] bg-[var(--rose-soft)] text-[var(--foreground)]",
  no: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]"
};

export function VoteSummaryAccordion({ items }: VoteSummaryAccordionProps) {
  return (
    <div className="grid gap-2">
      {items.map((item) => {
        const total = item.votes.length;
        const votesByChoice = {
          yes: item.votes.filter((vote) => vote.choice === "yes"),
          maybe: item.votes.filter((vote) => vote.choice === "maybe"),
          no: item.votes.filter((vote) => vote.choice === "no")
        };

        return (
          <details
            key={item.id}
            className="vote-summary-details ui-panel overflow-hidden border-[var(--border)] bg-[var(--surface)]"
          >
            <summary className="grid w-full cursor-pointer gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-muted)]/50 sm:px-4 sm:py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold tracking-[-0.03em] text-[var(--foreground)] sm:text-base">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">
                    {total} totalt {String.fromCharCode(183)} {item.counts.yes} ja{" "}
                    {String.fromCharCode(183)} {item.counts.maybe} kanske{" "}
                    {String.fromCharCode(183)} {item.counts.no} nej
                  </p>
                </div>

                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1">
                    <span>Visa namn</span>
                    <span
                      aria-hidden="true"
                      className="vote-summary-chevron inline-block"
                    >
                      {String.fromCharCode(9662)}
                    </span>
                  </span>
                </span>
              </div>

              <div
                aria-label={`Röstfördelning för ${item.label}`}
                className="h-2 overflow-hidden rounded-full bg-[var(--stone)]"
              >
                <div className="flex h-full w-full min-w-0">
                  {total > 0 ? (
                    <>
                      <span
                        className={choiceBarClasses.yes}
                        style={{ width: `${(item.counts.yes / total) * 100}%` }}
                      />
                      <span
                        className={choiceBarClasses.maybe}
                        style={{ width: `${(item.counts.maybe / total) * 100}%` }}
                      />
                      <span
                        className={choiceBarClasses.no}
                        style={{ width: `${(item.counts.no / total) * 100}%` }}
                      />
                    </>
                  ) : (
                    <span className="h-full w-full bg-[var(--stone)]" />
                  )}
                </div>
              </div>
            </summary>

            <div className="vote-summary-content">
              <div className="overflow-hidden">
                <div className="grid gap-2 border-t border-[var(--border)] px-3 py-2.5 text-sm sm:grid-cols-3 sm:px-4">
                  {(["yes", "maybe", "no"] as const).map((choice) => {
                    const choiceVotes = votesByChoice[choice];

                    return (
                      <div key={choice} className="grid gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">
                            {choiceLabels[choice]}
                          </p>
                          <span
                            className={[
                              "rounded-full border px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.08em]",
                              choiceChipClasses[choice]
                            ].join(" ")}
                          >
                            {choiceVotes.length}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {choiceVotes.length ? (
                            choiceVotes.map((vote) => (
                              <span
                                key={vote.id}
                                className={[
                                  "rounded-full border px-2 py-1 text-xs font-semibold leading-tight",
                                  choiceChipClasses[choice]
                                ].join(" ")}
                              >
                                {vote.voter_name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[var(--muted)]">
                              Inga röster
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
