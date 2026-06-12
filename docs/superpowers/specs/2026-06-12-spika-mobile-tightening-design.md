# Spika Mobile Tightening Design

## Goal

Make Spika comfortable on phones without adding a separate mobile domain. The site keeps one canonical URL structure and uses responsive layout rules so phone visitors get a tighter mobile experience automatically.

## Routing Decision

Do not add `m.spika.nu`. Keeping one domain is the most stable and lowest-maintenance option: no DNS work, no Vercel domain setup, no redirect loops, and no split sharing behavior. Shared event links stay identical on desktop and mobile.

## UI Scope

Tighten the existing responsive UI rather than redesigning the product. The main targets are the header, homepage hero, create form, event page, share link, vote cards, suggestion form, and admin list. Desktop should remain visually close to the current approved design.

## Mobile Behavior

On small screens:

- Page padding is reduced and more consistent.
- Headings are smaller and less likely to dominate the first viewport.
- Primary buttons and form buttons become full-width.
- Inputs and tap targets stay large enough for touch.
- Event and vote cards stack cleanly with less horizontal pressure.
- Share-link controls no longer reserve desktop-only horizontal space.
- Vote chips are easier to tap and distribute evenly.

## Non-Goals

- No new mobile subdomain.
- No duplicate mobile app.
- No database or server-action changes.
- No change to event IDs, search, voting, admin auth, or data behavior.

## Verification

Run lint, typecheck, and build. Validate the rendered site at desktop and mobile widths, with focus on homepage, create page, event page, and admin/login surfaces where available.
