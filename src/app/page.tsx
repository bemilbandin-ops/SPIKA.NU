import Link from "next/link";

import { SearchEventForm } from "@/components/SearchEventForm";

const previewDates = [
  {
    day: "Fredag",
    time: "18:00",
    counts: { yes: 4, maybe: 1, no: 0 },
    active: "yes"
  },
  {
    day: "Lördag",
    time: "14:00",
    counts: { yes: 3, maybe: 2, no: 1 },
    active: "maybe"
  },
  {
    day: "Söndag",
    time: "11:00",
    counts: { yes: 2, maybe: 3, no: 1 },
    active: "no"
  }
] as const;

function PreviewIcon() {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--accent)] sm:h-20 sm:w-20">
      <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 48 48">
        <path
          d="M17 8v16M11 8v10c0 3.3 2.7 6 6 6s6-2.7 6-6V8M17 24v16"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path
          d="M34 9c-4 3.3-6 8-6 14v1h6v16"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function PreviewVoteChip({
  label,
  active
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={[
        "rounded-full border px-4 py-2 text-sm font-bold sm:px-5",
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0.7rem_1.4rem_rgba(25,53,38,0.14)]"
          : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]"
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-[calc(100vw-2rem)] max-w-7xl min-w-0 items-center gap-8 py-7 sm:w-full sm:min-h-[calc(100vh-4.6rem)] sm:gap-10 sm:px-8 sm:py-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-14">
        <div className="min-w-0 max-w-xl">
          <p className="mb-6 text-3xl font-extrabold tracking-[-0.05em] text-[var(--accent)] sm:mb-10 sm:text-5xl">
            Spika
          </p>
          <h1 className="max-w-[13ch] text-4xl font-extrabold leading-[1.08] tracking-[-0.055em] text-[var(--foreground)] sm:max-w-[12ch] sm:text-6xl lg:text-7xl">
            Planera enkelt med gruppen
          </h1>
          <p className="mt-5 max-w-[21rem] text-base leading-7 text-[var(--foreground)]/85 sm:mt-7 sm:max-w-lg sm:text-lg sm:leading-8">
            Skapa en privat planering, dela länken och låt alla rösta på tider
            som fungerar.
          </p>

          <div className="mt-7 grid max-w-[34rem] gap-5 sm:mt-10 sm:gap-7">
            <Link
              href="/create"
              className="ui-button ui-button-primary ui-button-lg group w-[18rem] max-w-full justify-between sm:w-[21rem]"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--accent-foreground)]/75 text-xl leading-none">
                  +
                </span>
                Skapa planering
              </span>
              <span
                aria-hidden="true"
                className="text-2xl transition group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm text-[var(--foreground)]/75">
              <span className="h-px bg-[var(--border)]" />
              <span>eller</span>
              <span className="h-px bg-[var(--border)]" />
            </div>

            <SearchEventForm variant="hero" />
          </div>
        </div>

        <div className="ui-panel min-w-0 w-full p-4 sm:p-7 lg:p-9">
          <div className="grid gap-5 border-b border-[var(--border)] pb-7 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <PreviewIcon />
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
                Middag hos Lina
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                <span aria-hidden="true">▧</span>
                Privat planeringslänk
              </p>
            </div>
            <button
              className="ui-button ui-button-secondary mobile-full sm:w-fit"
              type="button"
            >
              Kopiera länk
            </button>
          </div>

          <div className="pt-7">
            <h3 className="text-lg font-extrabold text-[var(--foreground)]">
              Datumförslag
            </h3>
            <div className="mt-5 grid gap-4">
              {previewDates.map((date) => (
                <div
                  className="ui-row grid min-w-0 gap-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={`${date.day}-${date.time}`}
                >
                  <div>
                    <p className="text-xl font-extrabold tracking-[-0.025em]">
                      {date.day} {date.time}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
                      <span>{date.counts.yes} ja</span>
                      <span>{date.counts.maybe} kanske</span>
                      <span>{date.counts.no} nej</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PreviewVoteChip
                      active={date.active === "yes"}
                      label="Ja"
                    />
                    <PreviewVoteChip
                      active={date.active === "maybe"}
                      label="Kanske"
                    />
                    <PreviewVoteChip
                      active={date.active === "no"}
                      label="Nej"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="ui-button ui-button-secondary mobile-full mt-6 sm:w-fit"
              type="button"
            >
              <span className="text-2xl leading-none">+</span>
              Föreslå en annan tid
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
