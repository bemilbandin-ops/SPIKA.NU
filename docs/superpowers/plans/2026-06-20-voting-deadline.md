# Voting Deadline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let event creators optionally close voting and suggestions at a specified Swedish local date and time.

**Architecture:** Store one nullable timezone-aware deadline on the event. A small dependency-free helper converts `datetime-local` values in `Europe/Stockholm`, formats them, and decides whether an event is closed; both write paths enforce that decision server-side while the page also removes closed forms.

**Tech Stack:** Next.js server actions, React, TypeScript, Drizzle ORM, PostgreSQL, Node test runner, native `Intl`.

---

### Task 1: Deadline parsing and state

**Files:**
- Create: `src/lib/votingDeadline.ts`
- Create: `src/lib/votingDeadline.test.ts`

- [ ] **Step 1: Write failing tests**

Test that empty input returns `null`, ordinary Stockholm local time converts to
UTC, a spring DST gap is rejected, the first autumn occurrence is selected,
past deadlines are rejected, and `isVotingClosed(deadline, now)` closes exactly
at the deadline.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/votingDeadline.test.ts`

Expected: FAIL because `./votingDeadline` does not exist.

- [ ] **Step 3: Implement the native helper**

Export:

```ts
parseVotingDeadline(value: string, now?: Date): Date | null
isVotingClosed(deadline: Date | null, now?: Date): boolean
formatVotingDeadline(deadline: Date): string
```

Use `Intl.DateTimeFormat(..., { timeZone: "Europe/Stockholm" })` to compare
candidate UTC instants with the submitted local components. Search the bounded
UTC range covering Stockholm offsets, retain matching instants, and choose the
earliest match.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/lib/votingDeadline.test.ts`

Expected: all deadline tests pass.

### Task 2: Persist the optional deadline

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/data/events.ts`
- Modify: `src/app/create/actions.ts`
- Modify: `src/components/CreateEventForm.tsx`
- Create: `drizzle/0005_*.sql`
- Modify: `drizzle/meta/_journal.json`
- Create: `drizzle/meta/0005_snapshot.json`

- [ ] **Step 1: Add the schema field**

Add nullable `votingClosesAt: timestamp("voting_closes_at", { withTimezone:
true })` to `events`, expose it as `voting_closes_at` in event records and
selections, and pass it to event insertion.

- [ ] **Step 2: Add the form input**

Add a native optional field:

```tsx
<input type="datetime-local" name="votingClosesAt" />
```

Read it in `createEventAction` and parse it in `createEvent` before the
transaction.

- [ ] **Step 3: Generate the migration**

Run: `npm run db:generate`

Expected: one migration adding nullable `events.voting_closes_at`.

- [ ] **Step 4: Verify types and tests**

Run: `npm run typecheck && npm test`

Expected: both commands pass.

### Task 3: Enforce and display closing

**Files:**
- Modify: `src/lib/data/votes.ts`
- Modify: `src/lib/data/suggestions.ts`
- Modify: `src/app/event/[id]/page.tsx`

- [ ] **Step 1: Enforce the deadline in both writes**

Select `events.votingClosesAt` in each existing transaction. Before inserting,
throw `Röstningen är stängd.` when `isVotingClosed(...)` is true. Preserve this
message instead of replacing it with the generic database error.

- [ ] **Step 2: Update the event page**

Compute `votingClosed` once. Under the creator line render:

```tsx
Röstningen stänger {formatVotingDeadline(event.voting_closes_at)}
```

with the same `ui-note text-sm font-semibold` typography. Replace vote forms
and the suggestion form with `Röstningen är stängd.` after closing.

- [ ] **Step 3: Verify the feature**

Run: `npm run lint && npm run typecheck && npm test`

Expected: all commands pass without errors.

### Task 4: Production verification

**Files:**
- Review all changed files.

- [ ] **Step 1: Inspect the migration and diff**

Run: `git diff --check && git diff --stat && git status --short`

Expected: no whitespace errors; only deadline-related files changed.

- [ ] **Step 2: Build**

Run: `npm run build`

Expected: production build exits successfully.

- [ ] **Step 3: Commit implementation**

```bash
git add src drizzle docs/superpowers/plans/2026-06-20-voting-deadline.md
git commit -m "Add optional voting deadline"
```
