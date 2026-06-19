"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { subscribeToEventNotifications } from "@/lib/data/subscribers";
import { addDateSuggestion } from "@/lib/data/suggestions";
import { submitVote } from "@/lib/data/votes";
import type { VoteChoice } from "@/lib/types";

export type EventFormState = {
  error?: string;
};

export type NotificationSignupFormState = {
  error?: string;
  success?: string;
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

export async function subscribeAction(
  _previousState: NotificationSignupFormState,
  formData: FormData
): Promise<NotificationSignupFormState> {
  if (readString(formData, "companyWebsite")) {
    return {
      success: "Klart! Du får en sammanfattning när planeringen ändras."
    };
  }

  try {
    await subscribeToEventNotifications({
      eventId: readString(formData, "eventId"),
      email: readString(formData, "email"),
      intervalHours: readString(formData, "intervalHours")
    });
  } catch (error) {
    return { error: getReadableActionError(error) };
  }

  return {
    success: "Klart! Du får en sammanfattning när planeringen ändras."
  };
}
