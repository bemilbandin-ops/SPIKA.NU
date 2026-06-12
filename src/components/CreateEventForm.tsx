"use client";

import { useActionState } from "react";

import {
  createEventAction,
  type CreateEventFormState
} from "@/app/create/actions";
import { getAllowedDateRange } from "@/lib/dateLimits";

const initialState: CreateEventFormState = {};

export function CreateEventForm() {
  const dateRange = getAllowedDateRange();
  const [state, formAction, isPending] = useActionState(
    createEventAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="ui-panel grid gap-5 p-4 sm:p-6"
    >
      {state.error ? (
        <p
          className="ui-error text-sm"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <label className="ui-label">
        Titel
        <input
          type="text"
          name="title"
          required
          maxLength={120}
          placeholder="Middag med teamet"
          className="ui-input text-base normal-case tracking-normal"
        />
      </label>

      <label className="ui-label">
        Beskrivning
        <textarea
          name="description"
          rows={4}
          maxLength={500}
          placeholder="Lägg till detaljer som gästerna behöver veta."
          className="ui-input resize-y text-base normal-case tracking-normal"
        />
      </label>

      <label className="ui-label">
        Ditt namn
        <input
          type="text"
          name="creatorName"
          required
          maxLength={80}
          placeholder="Alex"
          className="ui-input text-base normal-case tracking-normal"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="ui-label">
          Föreslaget datum
          <input
            type="date"
            name="suggestedDate"
            required
            min={dateRange.min}
            max={dateRange.max}
            className="ui-input text-base normal-case tracking-normal"
          />
        </label>

        <label className="ui-label">
          Föreslagen tid
          <input
            type="time"
            name="suggestedTime"
            required
            className="ui-input text-base normal-case tracking-normal"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="ui-button ui-button-primary mobile-full sm:w-fit"
      >
        {isPending ? "Skapar..." : "Skapa planering"}
      </button>
    </form>
  );
}
