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
      className="ui-panel grid gap-4 p-3 sm:p-4"
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

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="ui-label">
          E-post för aviseringar (valfritt)
          <input
            type="email"
            name="notificationEmail"
            maxLength={254}
            placeholder="alex@example.com"
            className="ui-input text-base normal-case tracking-normal"
          />
        </label>

        <label className="ui-label">
          Hur ofta
          <select
            name="notificationIntervalHours"
            defaultValue="24"
            className="ui-input text-base normal-case tracking-normal"
          >
            <option value="24">Varje dygn</option>
            <option value="48">Varannan dag</option>
            <option value="72">Var tredje dag</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-slate-600">
        E-post är valfritt och skickas bara när planeringen ändras.
      </p>

      <label className="ui-label">
        Sista dagen för röstning (valfritt)
        <input
          type="datetime-local"
          name="votingClosesAt"
          className="ui-input text-base normal-case tracking-normal"
        />
        <span className="ui-field-copy">
          Svensk tid. Efter detta går det inte att rösta eller föreslå datum.
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
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
