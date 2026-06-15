import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { dateSuggestions, events, votes } from "@/db/schema";
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

  try {
    await getDb().transaction(async (tx) => {
      const [event] = await tx
        .select({ id: events.id })
        .from(events)
        .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
        .limit(1);

      if (!event) {
        throw new Error("Planeringen hittades inte.");
      }

      const [suggestion] = await tx
        .insert(dateSuggestions)
        .values({
          eventId,
          date,
          time,
          suggestedBy
        })
        .returning({ id: dateSuggestions.id });

      if (!suggestion) {
        throw new Error("Inget datumförslag returnerades efter sparning.");
      }

      await tx
        .insert(votes)
        .values({
          suggestionId: suggestion.id,
          voterName: suggestedBy,
          choice: "yes"
        })
        .onConflictDoUpdate({
          target: [votes.suggestionId, votes.voterName],
          set: { choice: "yes" }
        });
    });
  } catch (error) {
    throwDataError("adding date suggestion", error);
  }
}
