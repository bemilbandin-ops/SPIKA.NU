import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { dateSuggestions, events } from "@/db/schema";
import {
  getValidatedValue,
  validateDate,
  validateName,
  validateTime,
  validateUuid
} from "@/lib/validation";

function throwDataError(action: string, error: unknown): never {
  console.error(`Database error while ${action}.`, {
    message: error instanceof Error ? error.message : String(error)
  });

  throw new Error("Något gick fel när datumförslaget skulle sparas.");
}

export async function addDateSuggestion(input: {
  eventId: string;
  date: string;
  time?: string | null;
  suggestedBy: string;
}): Promise<void> {
  const eventId = getValidatedValue(validateUuid(input.eventId, "Planerings-ID"));
  const date = getValidatedValue(validateDate(input.date));
  const time = getValidatedValue(validateTime(input.time));
  const suggestedBy = getValidatedValue(validateName(input.suggestedBy));

  let eventExists = false;

  try {
    const [event] = await getDb()
      .select({ id: events.id })
      .from(events)
      .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
      .limit(1);

    eventExists = Boolean(event);
  } catch (error) {
    throwDataError("verifying event before adding suggestion", error);
  }

  if (!eventExists) {
    throw new Error("Planeringen hittades inte.");
  }

  try {
    await getDb().insert(dateSuggestions).values({
      eventId,
      date,
      time,
      suggestedBy
    });
  } catch (error) {
    throwDataError("adding date suggestion", error);
  }
}
