import Link from "next/link";
import type { ReactNode } from "react";

import { APP_NAME } from "@/lib/constants";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden">
      <header className="relative z-20 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm">
        <div className="mx-4 flex max-w-7xl flex-col items-start gap-2 py-3 sm:mx-auto sm:w-full sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-8 sm:py-4 lg:px-12">
          <Link
            href="/"
            className="focus-ring rounded-md border border-transparent px-1 text-xl font-extrabold tracking-[-0.035em] text-[var(--accent)] transition hover:text-[var(--accent-dark)] sm:text-2xl"
            aria-label={APP_NAME}
          >
            {APP_NAME}
          </Link>
          <nav
            aria-label="Huvudnavigering"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--muted)] sm:gap-1.5 sm:text-sm"
          >
            <Link
              className="focus-ring rounded-full border border-transparent px-2.5 py-1.5 transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] sm:px-3 sm:py-2"
              href="/create"
            >
              Skapa
            </Link>
            <Link
              className="focus-ring rounded-full border border-transparent px-2.5 py-1.5 transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] sm:px-3 sm:py-2"
              href="/admin"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
