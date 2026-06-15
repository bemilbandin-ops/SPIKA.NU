import Link from "next/link";
import { redirect } from "next/navigation";

import { deleteEventAction, logoutAction } from "@/app/admin/actions";
import { hasValidAdminSession } from "@/lib/adminAuth";
import { listRecentEventsForAdmin } from "@/lib/data/events";

function formatCreatedAt(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function AdminPage() {
  if (!(await hasValidAdminSession())) {
    redirect("/admin/login");
  }

  const events = await listRecentEventsForAdmin();

  return (
    <section className="page-frame grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-3">
          <h1 className="text-2xl font-extrabold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl">
            Senaste planeringarna
          </h1>
          <p className="text-sm leading-6 text-[var(--foreground)]/78 sm:text-base sm:leading-7">
            En enkel översikt över aktiva planeringslänkar.
          </p>
        </div>

        <form action={logoutAction} className="w-full sm:w-auto">
          <button
            className="ui-button ui-button-secondary mobile-full sm:w-auto"
            type="submit"
          >
            Logga ut
          </button>
        </form>
      </div>

      {events.length ? (
        <div className="grid gap-2.5">
          {events.map((event) => (
            <article
              className="ui-row grid gap-3 md:grid-cols-[1fr_auto] md:items-center"
              key={event.id}
            >
              <div className="grid gap-2">
                <h2 className="text-xl font-extrabold tracking-[-0.035em] text-[var(--foreground)]">
                  {event.title}
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Skapad {formatCreatedAt(event.created_at)}
                </p>
                <Link
                  className="focus-ring w-fit rounded-md text-sm font-extrabold uppercase tracking-[0.1em] text-[var(--accent)] transition hover:text-[var(--accent-dark)]"
                  href={`/event/${event.id}`}
                >
                  Öppna planering
                </Link>
              </div>

              <form action={deleteEventAction} className="w-full sm:w-auto">
                <input name="eventId" type="hidden" value={event.id} />
                <button
                  className="ui-button ui-button-secondary mobile-full sm:w-auto"
                  type="submit"
                >
                  Arkivera
                </button>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <p className="ui-panel p-5 text-[var(--muted)]">
          Inga aktiva planeringar hittades.
        </p>
      )}
    </section>
  );
}
