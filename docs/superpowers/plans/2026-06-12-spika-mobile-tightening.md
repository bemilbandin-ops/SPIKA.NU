# Spika Mobile Tightening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Spika easier to use on phones while keeping one canonical site URL.

**Architecture:** Keep the existing Next.js App Router pages and server actions. Improve responsive behavior through scoped Tailwind class changes and shared CSS utility updates.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS.

---

### Task 1: Tighten Shared Mobile Shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/AppShell.tsx`

- [ ] Reduce default `.page-frame` mobile width/padding while preserving larger spacing at `sm`.
- [ ] Add a mobile-only `.mobile-full` helper for full-width phone controls.
- [ ] Make header spacing more compact on phones.
- [ ] Keep desktop header layout and navigation intact.

### Task 2: Tighten Homepage And Forms

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/create/page.tsx`
- Modify: `src/components/CreateEventForm.tsx`
- Modify: `src/components/SearchEventForm.tsx`

- [ ] Reduce mobile homepage hero height and heading scale.
- [ ] Hide or compress desktop-heavy preview details on narrow screens.
- [ ] Make create/search buttons full-width on phones.
- [ ] Keep desktop layout close to the current design.

### Task 3: Tighten Event Voting Flow

**Files:**
- Modify: `src/app/event/[id]/page.tsx`
- Modify: `src/components/ShareLink.tsx`
- Modify: `src/components/SuggestionForm.tsx`
- Modify: `src/components/VoteForm.tsx`

- [ ] Reduce event page heading/card pressure on phones.
- [ ] Make share link and copy button stack cleanly.
- [ ] Make voting controls easier to tap by distributing chips across the row.
- [ ] Make suggestion form submit button full-width on phones.

### Task 4: Tighten Admin Surfaces

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/login/page.tsx`

- [ ] Make admin action buttons full-width on phones.
- [ ] Reduce heading scale on mobile.
- [ ] Preserve desktop admin layout.

### Task 5: Verify

**Commands:**
- Run: `npm run lint`
- Run: `npm run typecheck`
- Run: `npm run build`

**Rendered QA:**
- Use the running dev server on `http://localhost:3001`.
- Check desktop and mobile widths.
- Confirm no framework overlay, meaningful page content, and no relevant console errors.
