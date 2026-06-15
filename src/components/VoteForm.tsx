"use client";

import { useActionState } from "react";

import {
  submitVoteAction,
  type EventFormState
} from "@/app/event/[id]/actions";

const initialState: EventFormState = {};

const voteLabels = {
  yes: "Ja",
  maybe: "Kanske",
  no: "Nej"
} as const;

type VoteFormProps = {
  eventId: string;
  suggestionId: string;
};

export function VoteForm({ eventId, suggestionId }: VoteFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitVoteAction,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="suggestionId" value={suggestionId} />

      {state.error ? (
        <p className="ui-error text-sm" role="alert">
          {state.error}
        </p>
      ) : null}

      <label className="ui-label text-[0.7rem]">
        Ditt namn
        <input
          type="text"
          name="voterName"
          required
          maxLength={80}
          className="ui-input py-2 text-sm normal-case tracking-normal"
        />
      </label>

      <fieldset className="grid gap-1">
        <legend className="ui-label mb-0.5 text-[0.7rem]">
          Din röst
        </legend>
        <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-1.5">
          {(["yes", "maybe", "no"] as const).map((choice) => (
            <label key={choice} className="vote-chip min-w-0">
              <input type="radio" name="choice" value={choice} required />
              {voteLabels[choice]}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="ui-button ui-button-primary mobile-full sm:w-fit"
      >
        {isPending ? "Sparar..." : "Spara röst"}
      </button>
    </form>
  );
}
