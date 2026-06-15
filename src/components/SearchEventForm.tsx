"use client";

import { useActionState } from "react";

import {
  searchEventAction,
  type SearchEventFormState
} from "@/app/search/actions";

const initialState: SearchEventFormState = {};

type SearchEventFormProps = {
  variant?: "default" | "hero";
};

export function SearchEventForm({ variant = "default" }: SearchEventFormProps) {
  const [state, formAction, isPending] = useActionState(
    searchEventAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className={[
        "grid w-full max-w-[21rem] gap-3 sm:max-w-none sm:grid-cols-[1fr_auto] sm:items-start",
        variant === "hero" ? "" : "ui-panel p-4"
      ].join(" ")}
    >
      <div className="grid gap-2">
        <label className="sr-only" htmlFor="eventSearch">
          Sök planeringar
        </label>
        <input
          id="eventSearch"
          name="eventSearch"
          type="search"
          placeholder="Ange sök-ID eller URL"
          autoComplete="off"
          className="ui-input min-h-11 text-base"
        />
        {state.error ? (
          <p className="ui-error text-sm font-semibold" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="ui-button ui-button-secondary mobile-full min-h-11 px-5 sm:w-auto"
      >
        {isPending ? "Söker..." : "Hitta"}
      </button>
    </form>
  );
}
