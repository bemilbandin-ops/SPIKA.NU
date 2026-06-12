# How To Run Spika

This guide explains how to run Spika on your own computer so you can inspect the site, and how to publish it online with Vercel and Neon.

## What You Need

- A recent version of Node.js. Use Node.js 20.9 or newer.
- A Neon account for the database.
- A Vercel account for going live.
- The project files on your computer.

## Run It Locally

### 1. Open a Terminal in the Project Folder

Open a terminal and go to this folder:

```text
D:\Code\vscode\SPika\Spika
```

### 2. Install the App

Run this command once:

```bash
npm install
```

### 3. Create Your Local Settings File

Copy `.env.example` and name the copy `.env.local`.

Fill in these values in `.env.local`:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=your-neon-database-connection-string
ADMIN_PASSWORD=choose-an-admin-password
ADMIN_SESSION_SECRET=choose-a-long-random-secret
```

`NEXT_PUBLIC_SITE_URL` is safe to be public. Keep the other three values private.

### 4. Prepare the Database

After `DATABASE_URL` is filled in, run:

```bash
npm run db:migrate
```

This creates the database tables Spika needs.

### 5. Start the Local Site

Run:

```bash
npm run dev
```

Open this address in your browser:

```text
http://localhost:3000
```

### 6. Inspect the Site

Try this simple test:

1. Open the homepage.
2. Click `Create an event`.
3. Create a test event.
4. Add a date suggestion.
5. Vote `yes` with your name.
6. Vote again as the same name with `maybe`; the vote should update.
7. Add another date suggestion.
8. Visit `http://localhost:3000/admin`.
9. Log in with `ADMIN_PASSWORD`.
10. Soft-delete the test event.
11. Open the event link again and confirm it no longer appears.

## Go Live

### 1. Create the Database in Neon

1. Sign in to Neon.
2. Create a new project.
3. Copy the Postgres connection string.
4. Keep that connection string private. It will be your `DATABASE_URL`.

### 2. Run the Database Migration

On your computer, make sure `DATABASE_URL` points to the Neon database you want to use for the live site, then run:

```bash
npm run db:migrate
```

### 3. Deploy the Site with Vercel

1. Sign in to Vercel.
2. Import this project from GitHub.
3. Choose the Next.js preset if Vercel asks.
4. Add these environment variables in Vercel:

```text
NEXT_PUBLIC_SITE_URL=https://your-live-site-address
DATABASE_URL=your-neon-database-connection-string
ADMIN_PASSWORD=choose-an-admin-password
ADMIN_SESSION_SECRET=choose-a-long-random-secret
```

Use the real Vercel site address for `NEXT_PUBLIC_SITE_URL`, with no slash at the end.

### 4. Deploy

Click Vercel's deploy button. When it finishes, open the live site address.

### 5. Check the Live Site

Do the same inspection steps from the local section:

1. Create a test event.
2. Add a date suggestion.
3. Vote on it.
4. Log in at `/admin`.
5. Soft-delete the test event.
6. Confirm the deleted event link no longer works.

## Important Privacy Note

Spika uses private links, not user accounts. Anyone with an event link can view that event's details, names, date suggestions, and votes. Do not put sensitive information in an event.

## Useful Commands

Run these before deploying if you want to check the project:

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

`npm run check` runs the main verification checks together.
