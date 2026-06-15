"use client";

import { useActionState } from "react";

import {
  addSuggestionAction,
  type EventFormState
} from "@/app/event/[id]/actions";
import { getAllowedDateRange } from "@/lib/dateLimits";

const initialState: EventFormState = {};

type SuggestionFormProps = {
  eventId: string;
};

export function SuggestionForm({ eventId }: SuggestionFormProps) {
  const dateRange = getAllowedDateRange();
  const [state, formAction, isPending] = useActionState(
    addSuggestionAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="ui-panel grid gap-4 p-3 sm:p-4"
    >
      <input type="hidden" name="eventId" value={eventId} />

      <div className="grid gap-1">
        <h2 className="text-xl font-extrabold tracking-[-0.035em] text-[var(--foreground)] sm:text-2xl">
          Föreslå ett annat datum
        </h2>
        <p className="ui-field-copy">
          Lägg till ditt namn och datumet du vill att gruppen ska överväga.
        </p>
      </div>

      {state.error ? (
        <p
          className="ui-error text-sm"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <label className="ui-label">
        Ditt namn
        <input
          type="text"
          name="suggestedBy"
          required
          maxLength={80}
          className="ui-input text-base normal-case tracking-normal"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="ui-label">
          Datum
          <input
            type="date"
            name="date"
            required
            min={dateRange.min}
            max={dateRange.max}
            className="ui-input text-base normal-case tracking-normal"
          />
        </label>

        <label className="ui-label">
          Tid (valfritt)
          <input
            type="time"
            name="time"
            className="ui-input text-base normal-case tracking-normal"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="ui-button ui-button-primary mobile-full sm:w-fit"
      >
        {isPending ? "Lägger till..." : "Lägg till förslag"}
      </button>
    </form>
  );
}
