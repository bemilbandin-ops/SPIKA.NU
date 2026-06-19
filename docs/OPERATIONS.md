# Operations

## Rotate `ADMIN_PASSWORD`

1. Generate a new strong password.
2. Update `ADMIN_PASSWORD` in Vercel project environment variables.
3. Redeploy the app.
4. Share the new password only with the app owner or admin operator.

Existing admin sessions may continue until the signed session cookie is cleared or expires. Rotate `ADMIN_SESSION_SECRET` too if all existing admin sessions must be invalidated immediately.

## Rotate `ADMIN_SESSION_SECRET`

1. Generate a new long random secret.
2. Update `ADMIN_SESSION_SECRET` in Vercel project environment variables.
3. Redeploy the app.

This secret signs the admin session cookie. Rotating it invalidates existing admin sessions, so admins must log in again with `ADMIN_PASSWORD`.

## Rotate Neon Credentials / `DATABASE_URL`

1. Create or reset the database role credentials in Neon.
2. Copy the new pooled or standard connection string.
3. Update `DATABASE_URL` in Vercel project environment variables.
4. Redeploy the app.
5. Update the local environment used for migrations and development.
6. Run a smoke test against the deployed app.

Keep old credentials active until the redeploy is complete if you need to avoid downtime.

## Run Drizzle Migrations

Make sure `DATABASE_URL` points at the database that should receive the migration, then run:

```bash
npm install
npm run db:migrate
```

Use `npm run db:generate` only after changing `src/db/schema.ts`. Commit generated migration files under `drizzle/`.

## Soft-Delete Events

1. Open `/admin`.
2. Log in with `ADMIN_PASSWORD`.
3. Find the event in recent active events.
4. Click `Soft-delete`.

Soft-delete sets `deleted_at`. Deleted events no longer render on their event page and no longer appear in the admin list, but rows remain in the database.

## Inspect Database Rows

Use the Neon SQL editor to inspect tables directly, or run Drizzle Studio with `DATABASE_URL` set to the database you want to inspect:

```bash
npm run db:studio
```

Core tables are `events`, `date_suggestions`, `votes`, and `event_subscribers`.

## Known Limitations

- Anyone with an event link can view event details, names, votes, and suggestions.
- No user accounts.
- No email invite system.
- No realtime updates.
- Login rate limiting may require Vercel/provider protection or an external store if not implemented in code.
- Free hosting/database tiers have usage limits and can change.
