# Deployment

Use these steps to deploy PickADay to Vercel with Neon Postgres.

## 1. Neon Setup

1. Create a free Neon account and project.
2. Create a Postgres database or use the default database Neon creates.
3. Copy the pooled or standard Postgres connection string.
4. Store it as `DATABASE_URL` and keep it private.

## 2. Local Migration Setup

Install dependencies:

```bash
npm install
```

Make sure `DATABASE_URL` points at the Neon database, then run the committed Drizzle migrations:

```bash
npm run db:migrate
```

The project migration command is `npm run db:migrate`, which runs `drizzle-kit migrate`.

## 3. Vercel Setup

1. Import the GitHub repository into Vercel.
2. Use the Next.js framework preset if Vercel does not detect it automatically.
3. Set these environment variables in the Vercel project:

```text
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.example
DATABASE_URL=your-neon-connection-string
ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=your-random-session-secret
```

4. Deploy the project.

`NEXT_PUBLIC_SITE_URL` should be the deployed site origin with no trailing slash. Keep `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` private.

## 4. Post-Deploy Smoke Test

1. Open the homepage.
2. Create an event.
3. Copy the event link.
4. Add a date suggestion.
5. Vote on the suggestion.
6. Log into `/admin`.
7. Soft-delete the test event.
8. Open the deleted event link and confirm it no longer renders.

## 5. Troubleshooting

- Missing env vars: confirm all four required variables are set in Vercel and locally when running migrations.
- Wrong `DATABASE_URL`: confirm the connection string points to the intended Neon project, database, branch, and role.
- Migration not run: run `npm run db:migrate` with `DATABASE_URL` set to the deployed Neon database.
- Admin password not working: confirm `ADMIN_PASSWORD` is set in Vercel, redeploy after changing it, and try again in a fresh browser session.
- Build failure: run `npm run check` locally and fix lint, typecheck, or build errors before redeploying.
- Database connection limit errors: use Neon's pooled connection string for `DATABASE_URL`, reduce concurrent traffic, or move to a larger Neon tier.
