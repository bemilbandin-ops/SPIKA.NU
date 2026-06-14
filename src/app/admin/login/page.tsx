import { redirect } from "next/navigation";

import { hasValidAdminSession } from "@/lib/adminAuth";
import { loginAction } from "./actions";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams
}: AdminLoginPageProps) {
  if (await hasValidAdminSession()) {
    redirect("/admin");
  }

  const params = searchParams ? await searchParams : undefined;
  const hasError = params?.error === "invalid";

  return (
    <section className="page-frame grid max-w-md content-start gap-5">
      <div className="grid gap-3">
        <h1 className="text-2xl font-extrabold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl">
          Logga in
        </h1>
        <p className="text-sm leading-6 text-[var(--foreground)]/78 sm:text-base sm:leading-7">
          Administrera aktiva planeringar och arkivera sådant som är klart.
        </p>
      </div>

      <form
        action={loginAction}
        className="ui-panel grid gap-4 p-3 sm:p-4"
      >
        <label className="ui-label">
          Lösenord
          <input
            autoComplete="current-password"
            className="ui-input text-base normal-case tracking-normal"
            name="password"
            required
            type="password"
          />
        </label>

        {hasError ? (
          <p className="ui-error text-sm">
            Ogiltigt lösenord.
          </p>
        ) : null}

        <button
          className="ui-button ui-button-primary mobile-full sm:w-auto"
          type="submit"
        >
          Logga in
        </button>
      </form>
    </section>
  );
}
