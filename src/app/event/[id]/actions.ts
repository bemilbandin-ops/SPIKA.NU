"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addDateSuggestion } from "@/lib/data/suggestions";
import { submitVote } from "@/lib/data/votes";
import type { VoteChoice } from "@/lib/types";

export type EventFormState = {
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

export async function addSuggestionAction(
  _previousState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const eventId = readString(formData, "eventId");

  try {
    await addDateSuggestion({
      eventId,
      date: readString(formData, "date"),
      time: readString(formData, "time"),
      suggestedBy: readString(formData, "suggestedBy")
    });
  } catch (error) {
    return { error: getReadableActionError(error) };
  }

  revalidatePath(`/event/${eventId}`);
  redirect(`/event/${eventId}`);
}

export async function submitVoteAction(
  _previousState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const eventId = readString(formData, "eventId");

  try {
    await submitVote({
      eventId,
      suggestionId: readString(formData, "suggestionId"),
      voterName: readString(formData, "voterName"),
      choice: readString(formData, "choice") as VoteChoice
    });
  } catch (error) {
    return { error: getReadableActionError(error) };
  }

  revalidatePath(`/event/${eventId}`);
  redirect(`/event/${eventId}`);
}
