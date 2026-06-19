# PickADay

PickADay is a simplified group date planner. One person creates an event, shares the private event link, and the group can add date suggestions and vote yes, maybe, or no by name.

## What v1 Includes

- Event creation with a title and optional description.
- Private event pages available to anyone with the event link.
- Date suggestions with optional times and the name of the person suggesting them.
- Votes on each suggestion: yes, maybe, or no.
- Optional email digests when suggestions or votes change, with 24, 48, or 72-hour intervals and unsubscribe links.
- A password-protected admin page for viewing recent active events and soft-deleting events.

## What v1 Does Not Include

- User accounts or per-person authentication.
- Email invitations.
- Realtime updates.
- Role-based admin access.
- Hard-delete tooling in the UI.

## Tech Stack

- Next.js App Router, React, and TypeScript.
- Tailwind CSS.
- PostgreSQL through `DATABASE_URL`, intended for Neon.
- Drizzle ORM and Drizzle Kit migrations.
- Vercel deployment.

This rebuild only needs a Postgres database and does not use Supabase.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Database Setup

Create a Neon Postgres database, then put the connection string in `DATABASE_URL`. For local development, make sure `DATABASE_URL` is available to the app and to Drizzle before running migrations.

```bash
npm run db:migrate
```

## Environment Variables

`.env.example` lists the required variables:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
RESEND_API_KEY=
NOTIFICATION_FROM_EMAIL=
CRON_SECRET=
```

`NEXT_PUBLIC_SITE_URL` is public. Keep every other value private and server-side. `NOTIFICATION_FROM_EMAIL` must use a sender accepted by Resend.

## Drizzle Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

Run `db:generate` after schema changes. Run `db:migrate` to apply committed migrations. Use `db:studio` for local database inspection when `DATABASE_URL` points at the database you want to inspect.

## Run And Check Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run check
```

`npm run check` runs lint, typecheck, tests, and a production build.

## Deployment

Deploy with Vercel and Neon using [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Admin Notes

Visit `/admin` to sign in with `ADMIN_PASSWORD`. The app stores admin access in an HTTP-only cookie signed with `ADMIN_SESSION_SECRET`. Rotating the session secret invalidates existing admin sessions.

Admin soft-delete hides an event from its event page and the admin list by setting `deleted_at`; it does not remove database rows.

## Privacy Note

Anyone with an event link can view that event's details, names, suggestions, and votes. Do not use PickADay for sensitive event details.
