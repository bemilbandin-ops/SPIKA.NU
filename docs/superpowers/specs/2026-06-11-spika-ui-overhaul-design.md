# Spika UI Overhaul Design

Date: 2026-06-11

## Goal

Redesign Spika completely while preserving the current product behavior:

- Create a private event planning link.
- Search for an existing planning by URL or planning ID.
- Share an event link and search code.
- Add date suggestions.
- Vote `Ja`, `Kanske`, or `Nej` by name.
- Admin login, recent event list, logout, and archive actions.

The new interface should feel calm, mature, human, and minimal. It should not keep the current orange sketch-board style.

## Approved Direction

Use the revised "soft human minimal, less white" direction approved in chat.

Reference image:

- [Soft human minimal reference](../../concepts/spika-soft-human-minimal-reference.png)

Visual tone:

- Calm and adult, not playful or childlike.
- Sparse and easy to scan, not a dashboard.
- Muted colored surfaces instead of a mostly white page.
- Warm, social, and approachable without decorative clutter.

Palette:

- Page background: muted sage green.
- Main surfaces: warm cream, pale stone, and soft clay.
- Primary accent: deep forest green.
- Secondary accent: dusty rose, used sparingly.
- Text: dark charcoal green.
- Borders: low-contrast warm stone.

Avoid:

- Orange-dominant palette.
- Purple gradients.
- Bright primary colors.
- Decorative blobs, busy bento grids, and fake metrics.
- Toy-like shapes or kid-site energy.
- Large white empty page areas.

## Information Architecture

Keep the current routes:

- `/`: homepage with brand, create action, search form, and a quiet event preview.
- `/create`: create planning form.
- `/event/[id]`: shared event workspace.
- `/admin/login`: admin sign-in.
- `/admin`: recent planning list with archive action.

The app shell should remain simple: brand link, create link, admin link. Navigation should feel quiet and secondary.

## Homepage

The homepage should be the clearest expression of the new direction.

Layout:

- Full viewport or near-full viewport composition.
- Left side: brand, large headline, short supporting sentence, primary create button, compact search form.
- Right side: restrained preview of an event voting workspace.
- Use colored background and tinted panels so the page does not feel stark white.

Copy:

- Brand: `Spika`
- Headline: `Planera enkelt med gruppen`
- Primary action: `Skapa planering`
- Search placeholder: `Ange planerings-ID eller URL`
- Search action: `Hitta`

The preview should show the product purpose without becoming a dense dashboard: event title, share action, a few date rows, vote chips, and counts.

## Shared Components

Create a small visual system in CSS/Tailwind utility classes rather than one-off page styling.

Component families:

- App shell/header.
- Buttons: primary, secondary, ghost.
- Inputs and textareas.
- Form panels.
- Event/date option rows.
- Vote choice controls.
- Small status/info notes.
- Admin/event list rows.

Style rules:

- Rounded corners should be soft but not bubbly.
- Shadows should be subtle and broad.
- Borders should be quiet and warm.
- Controls should have deliberate typography, spacing, focus states, hover states, and disabled states.
- No nested card stacks unless the content genuinely needs containment.

## Event Page

The event page should feel like a shared planning room, not a report dashboard.

Top area:

- Event title and description.
- Creator's initial suggestion when present.
- Share link module with copy action and search code.
- Privacy note, visually quiet.

Voting area:

- Keep `Röstläge` / vote summary functionality but redesign it as a calm list of date options.
- Show leading option if there are yes votes.
- Use restrained bars or compact counts, but avoid graph-heavy presentation.
- Each suggestion should clearly show date, time, proposer, vote counts, existing voter names, and voting form.

Vote form:

- Keep name input and `Ja`, `Kanske`, `Nej` radio choices.
- Make choices feel like segmented chips or calm buttons.
- Preserve native form behavior and server actions.

Suggestion form:

- Keep name, date, optional time, and submit behavior.
- Present as a bottom panel that feels part of the workspace.

## Create Page

Keep the existing fields and validation:

- Title.
- Description.
- Creator name.
- Suggested date.
- Suggested time.

Presentation:

- Use a centered two-column or compact single-column layout depending on viewport.
- Use a calm page intro and a single form panel.
- Keep fields large enough for mobile use.

## Admin Pages

Admin should use the same design system but feel slightly more utilitarian.

Login:

- Centered sign-in panel.
- Same inputs, errors, and submit behavior.

Recent events:

- Header with title and logout.
- Quiet list rows for events.
- `Öppna planering` and `Arkivera` actions.
- Empty state should be simple and friendly.

## Responsive Behavior

Desktop:

- Homepage can use a two-column layout.
- Event page can use a primary content column with secondary/share area.

Mobile:

- Collapse to one column.
- Keep primary action and search visible early.
- Avoid horizontal scrolling.
- Vote chips should wrap cleanly.
- Date rows should remain readable without clipping.

## Accessibility

- Preserve semantic forms and labels.
- Keep focus-visible states for all interactive elements.
- Maintain sufficient contrast between text and tinted surfaces.
- Do not rely on color alone for vote meaning; text labels remain visible.
- Keep reduced-motion friendly behavior. No required animation.

## Testing

Run:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Manual checks:

- Homepage at desktop and mobile widths.
- Create planning page field layout.
- Event page with zero suggestions and with multiple suggestions/votes.
- Vote form radio behavior and disabled pending labels.
- Add suggestion form.
- Share link copy state.
- Admin login error state.
- Admin list and empty state.

## Out Of Scope

- Database schema changes.
- New user accounts.
- Realtime updates.
- Email invites or notifications.
- Changing server actions or persistence behavior unless required by UI wiring.
