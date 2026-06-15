# Event Page Compact Votes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make event pages easier to scan on desktop and mobile by adding a compact home link, tightening date suggestion cards, and letting vote summaries expand inline to reveal voter names.

**Architecture:** Keep the event page as a server component and extract the expandable vote summary into one focused client component. The page should keep rendering event data and compact date cards, while the client component owns only open/close state for the summary section. Shared layout cleanup stays in `globals.css` so the change remains consistent across event pages without introducing new style systems.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS utilities, existing `ui-*` design tokens.

---

### Task 1: Add the compact home link and update creator copy

**Files:**
- Modify: `src/app/event/[id]/page.tsx`

- [ ] **Step 1: Update the event header copy and add a top home link**

```tsx
import Link from "next/link";

// ...

<Link
  href="/"
  className="ui-button ui-button-secondary w-fit px-3 py-1.5 text-sm font-extrabold tracking-[-0.01em] sm:text-base"
>
  Spika!
</Link>

// ...

<p className="ui-note text-sm font-semibold sm:w-fit">
  Skapat av {creatorSuggestion.suggested_by}:{" "}
  {formatDate(creatorSuggestion.date)}
  {creatorSuggestionTime ? ` kl. ${creatorSuggestionTime}` : ""}
</p>
```

- [ ] **Step 2: Verify the page still renders**

Run: `npm run dev -- -H 0.0.0.0`
Expected: event pages load and the new `Spika!` link points to `/`.

### Task 2: Shrink the date suggestion cards and remove voter names from them

**Files:**
- Modify: `src/app/event/[id]/page.tsx`

- [ ] **Step 1: Tighten the suggestion card layout**

```tsx
<article
  key={suggestion.id}
  className="ui-panel grid gap-2.5 p-2.5 sm:gap-3 sm:p-3 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.46fr)] lg:items-start"
>
  <div className="grid gap-1.5">
    <div className="grid gap-0.5">
      <h3 className="text-base font-extrabold tracking-[-0.03em] text-[var(--foreground)] sm:text-lg">
        {formatDate(suggestion.date)}
      </h3>
      {time ? (
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
          {time}
        </p>
      ) : null}
    </div>

    <p className="text-xs text-[var(--muted)] sm:text-sm">
      Föreslaget av {suggestion.suggested_by}
    </p>

    <p className="flex flex-wrap gap-x-2.5 gap-y-1 text-xs font-bold text-[var(--muted)] sm:text-sm">
      <span>{counts.yes} ja</span>
      <span>{counts.maybe} kanske</span>
      <span>{counts.no} nej</span>
      <span>{suggestion.votes.length} totalt</span>
    </p>
  </div>

  <VoteForm eventId={event.id} suggestionId={suggestion.id} />
</article>
```

- [ ] **Step 2: Remove the voter-name list from each card**

```tsx
// Delete the `Röster` block that renders individual voter names.
```

- [ ] **Step 3: Verify cards are visibly smaller on desktop and mobile**

Run: `npm run dev -- -H 0.0.0.0`
Expected: each suggestion card is noticeably shorter and no longer shows individual voter names.

### Task 3: Add the expandable vote summary with compact bars and names

**Files:**
- Create: `src/components/VoteSummaryAccordion.tsx`
- Modify: `src/app/event/[id]/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Build a compact client component for the vote summary**

```tsx
"use client";

import { useState } from "react";

import type { VoteChoice, VoteRecord } from "@/lib/types";

type SummaryItem = {
  id: string;
  label: string;
  counts: { yes: number; maybe: number; no: number };
  votes: VoteRecord[];
};

const choiceLabels: Record<VoteChoice, string> = {
  yes: "Ja",
  maybe: "Kanske",
  no: "Nej"
};

const choiceStyles: Record<VoteChoice, string> = {
  yes: "bg-[var(--accent)]",
  maybe: "bg-[var(--rose)]",
  no: "bg-[var(--stone)]"
};

export function VoteSummaryAccordion({ items }: { items: SummaryItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid gap-2">
      {items.map((item) => {
        const total = item.votes.length;
        const open = openId === item.id;
        const yesPct = total ? Math.max(8, Math.round((item.counts.yes / total) * 100)) : 0;
        const maybePct = total ? Math.max(8, Math.round((item.counts.maybe / total) * 100)) : 0;
        const noPct = total ? Math.max(8, Math.round((item.counts.no / total) * 100)) : 0;

        return (
          <article key={item.id} className="ui-panel overflow-hidden border-[var(--border)] bg-[var(--surface)]">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="grid w-full gap-2 px-3 py-2 text-left sm:px-4 sm:py-3"
              aria-expanded={open}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold tracking-[-0.03em] text-[var(--foreground)] sm:text-base">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">
                    {total} totalt · {item.counts.yes} ja · {item.counts.maybe} kanske · {item.counts.no} nej
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
                  {open ? "Dölj namn" : "Visa namn"}
                </span>
              </div>

              <div className="grid h-2 overflow-hidden rounded-full bg-[var(--stone)]">
                <div className="flex h-full min-w-0">
                  <span className={choiceStyles.yes} style={{ width: `${yesPct}%` }} />
                  <span className={choiceStyles.maybe} style={{ width: `${maybePct}%` }} />
                  <span className={choiceStyles.no} style={{ width: `${noPct}%` }} />
                </div>
              </div>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid gap-2 border-t border-[var(--border)] px-3 py-2.5 text-sm sm:grid-cols-3 sm:px-4">
                  {(["yes", "maybe", "no"] as const).map((choice) => {
                    const names = item.votes.filter((vote) => vote.choice === choice).map((vote) => vote.voter_name);

                    return (
                      <div key={choice} className="grid gap-1">
                        <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">
                          {choiceLabels[choice]}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {names.length ? names.map((name) => (
                            <span key={name} className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">
                              {name}
                            </span>
                          )) : (
                            <span className="text-xs text-[var(--muted)]">Inga röster</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Swap the existing `Röstläge` list to use the new component**

```tsx
<VoteSummaryAccordion
  items={suggestionSummaries.map(({ suggestion, counts, label }) => ({
    id: suggestion.id,
    label,
    counts,
    votes: suggestion.votes
  }))}
/>
```

- [ ] **Step 3: Add any small CSS tweaks needed for compact spacing**

```css
.vote-summary-toggle {
  min-height: 2.75rem;
}
```

- [ ] **Step 4: Verify the summary expands smoothly and stays compact**

Run: `npm run dev -- -H 0.0.0.0`
Expected: each summary card shows a compact stacked bar, expands on click, and reveals grouped voter names without taking over the page.

