import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden">
      <main>{children}</main>
    </div>
  );
}
