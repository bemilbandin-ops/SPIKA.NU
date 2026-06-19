"use server";

import { redirect } from "next/navigation";

import { createEvent } from "@/lib/data/events";

export type CreateEventFormState = {
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

export async function createEventAction(
  _previousState: CreateEventFormState,
  formData: FormData
): Promise<CreateEventFormState> {
  let eventId: string;

  try {
    const event = await createEvent({
      title: readString(formData, "title"),
      description: readString(formData, "description"),
      creatorName: readString(formData, "creatorName"),
      suggestedDate: readString(formData, "suggestedDate"),
      suggestedTime: readString(formData, "suggestedTime"),
      notificationEmail: readString(formData, "notificationEmail"),
      notificationIntervalHours: readString(
        formData,
        "notificationIntervalHours"
      )
    });
    eventId = event.id;
  } catch (error) {
    return { error: getReadableActionError(error) };
  }

  redirect(`/event/${eventId}`);
}
