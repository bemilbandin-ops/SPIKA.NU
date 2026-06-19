"use client";

import { useActionState } from "react";

import {
  subscribeAction,
  type NotificationSignupFormState
} from "@/app/event/[id]/actions";

const initialState: NotificationSignupFormState = {};

export function NotificationSignupForm({ eventId }: { eventId: string }) {
  const [state, formAction, isPending] = useActionState(
    subscribeAction,
    initialState
  );

  return (
    <form action={formAction} className="ui-panel grid gap-2.5 p-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-10000px] h-px w-px opacity-0"
      />

      <h2 className="text-base font-extrabold tracking-[-0.035em]">
        Få aviseringar
      </h2>

      {state.error ? (
        <p className="ui-error text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="ui-note text-sm" role="status">
          {state.success}
        </p>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:items-end">
        <label className="ui-label">
          E-post
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            className="ui-input text-base normal-case tracking-normal"
          />
        </label>

        <label className="ui-label">
          Hur ofta
          <select
            name="intervalHours"
            defaultValue="24"
            className="ui-input text-base normal-case tracking-normal"
          >
            <option value="24">Varje dygn</option>
            <option value="48">Varannan dag</option>
            <option value="72">Var tredje dag</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="ui-button ui-button-primary"
        >
          {isPending ? "Sparar..." : "Få"}
        </button>
      </div>
    </form>
  );
}
