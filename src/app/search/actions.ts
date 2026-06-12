"use server";

import { redirect } from "next/navigation";

import { findEventIdBySearchCode } from "@/lib/data/events";
import {
  isEventSearchCode,
  isEventUuid,
  normalizeEventSearchInput
} from "@/lib/eventSearch";

export type SearchEventFormState = {
  error?: string;
};

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getReadableActionError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Något gick fel. Försök igen.";
}

export async function searchEventAction(
  _previousState: SearchEventFormState,
  formData: FormData
): Promise<SearchEventFormState> {
  let eventId: string | null = null;

  try {
    const query = normalizeEventSearchInput(readString(formData, "eventSearch"));

    if (!query) {
      throw new Error("Ange ett planerings-ID.");
    }

    if (isEventUuid(query)) {
      eventId = query;
    } else if (isEventSearchCode(query)) {
      eventId = await findEventIdBySearchCode(query);
    } else {
      throw new Error("Ange ett planerings-ID med 8 tecken eller en fullständig planerings-URL.");
    }

    if (!eventId) {
      throw new Error("Planeringen hittades inte.");
    }
  } catch (error) {
    return { error: getReadableActionError(error) };
  }

  redirect(`/event/${eventId}`);
}
