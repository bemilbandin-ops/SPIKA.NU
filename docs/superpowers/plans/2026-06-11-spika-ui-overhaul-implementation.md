# Spika UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the orange sketch-board UI with the approved soft human minimal Spika interface while preserving all current product behavior.

**Architecture:** Keep the existing Next.js app routes and server actions. Create a small CSS utility layer in `src/app/globals.css`, then restyle the app shell, public pages, event workspace, shared forms, and admin pages with those shared primitives.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4 utility classes, server actions, TypeScript.

---

### Task 1: Shared Visual System and Shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/AppShell.tsx`

- [ ] Replace orange global tokens with muted sage, warm cream, pale stone, soft clay, forest green, dusty rose, dark charcoal green, and warm stone border tokens.
- [ ] Remove sketch-specific helpers (`brand-mark`, `orange-panel`, `orange-glow`, `sketch-button`, `focus-orange`) and add shared classes for focus rings, panels, buttons, inputs, notes, and rows.
- [ ] Restyle the shell as a quiet secondary navigation with a simple text brand link and understated create/admin links.
- [ ] Verify header remains accessible and does not overlap route content on desktop or mobile.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 2: Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Modify as needed: `src/components/SearchEventForm.tsx`

- [ ] Replace the current matrix/place preview with the approved two-column hero composition.
- [ ] Use the required copy: brand `Spika`, headline `Planera enkelt med gruppen`, primary action `Skapa planering`, search placeholder `Ange planerings-ID eller URL`, search action `Hitta`.
- [ ] Build the right-side event voting preview with event title, privacy note, copy-link action, three date rows, vote chips, and compact counts.
- [ ] Keep the search form wired to `searchEventAction`.
- [ ] Ensure mobile collapses to one column without horizontal scrolling.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 3: Shared Forms and Controls

**Files:**
- Modify: `src/components/SearchEventForm.tsx`
- Modify: `src/components/CreateEventForm.tsx`
- Modify: `src/components/ShareLink.tsx`
- Modify: `src/components/VoteForm.tsx`
- Modify: `src/components/SuggestionForm.tsx`

- [ ] Apply shared form panel, label, input, textarea, button, and info-note styles.
- [ ] Preserve all field names, validation attributes, hidden inputs, `useActionState` wiring, and pending labels.
- [ ] Make vote choices read as segmented chips while retaining native radio input behavior.
- [ ] Keep share-link copy behavior and visible search code.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 4: Create Page

**Files:**
- Modify: `src/app/create/page.tsx`

- [ ] Present a calm page intro and a single form panel using the shared visual system.
- [ ] Keep the existing fields and validation through `CreateEventForm`.
- [ ] Use a compact single-column layout on mobile and a restrained centered layout on desktop.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 5: Event Workspace

**Files:**
- Modify: `src/app/event/[id]/page.tsx`

- [ ] Restyle the page as a shared planning room, not a dashboard.
- [ ] Preserve event title, description, creator suggestion, share link, privacy note, vote summary, date suggestions, voter names, vote form, and suggestion form.
- [ ] Redesign `Röstläge` as a calm list with compact counts and restrained yes bars.
- [ ] Show a leading option only when there are yes votes.
- [ ] Add a simple empty state when there are no suggestions.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 6: Admin Pages

**Files:**
- Modify: `src/app/admin/login/page.tsx`
- Modify: `src/app/admin/page.tsx`

- [ ] Restyle login as a centered sign-in panel with the same error and submit behavior.
- [ ] Restyle recent events as quiet utility rows with title, created date, open action, archive action, logout, and empty state.
- [ ] Preserve all redirects, admin session checks, server actions, form names, and action URLs.
- [ ] Run `npm run lint` and `npm run typecheck`.

### Task 7: Final Verification

**Files:**
- Verify: all modified files

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Start the local app and inspect `/`, `/create`, `/event/[id]` when a valid event is available, `/admin/login`, and `/admin`.
- [ ] Compare the homepage against `docs/concepts/spika-soft-human-minimal-reference.png` with `view_image` and a browser screenshot.
- [ ] Check desktop and mobile widths for overflow, clipping, focus visibility, and readable form controls.
