import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { dateSuggestions, events, votes } from "@/db/schema";
import type { VoteChoice } from "@/lib/types";
import {
  getValidatedValue,
  validateName,
  validateUuid,
  validateVoteChoice
} from "@/lib/validation";

function throwDataError(action: string, error: unknown): never {
  console.error(`Database error while ${action}.`, {
    message: error instanceof Error ? error.message : String(error)
  });

  throw new Error("Något gick fel när rösten skulle sparas.");
}

export async function submitVote(input: {
  eventId: string;
  suggestionId: string;
  voterName: string;
  choice: VoteChoice;
}): Promise<void> {
  const eventId = getValidatedValue(validateUuid(input.eventId, "Planerings-ID"));
  const suggestionId = getValidatedValue(
    validateUuid(input.suggestionId, "Förslags-ID")
  );
  const voterName = getValidatedValue(validateName(input.voterName));
  const choice = getValidatedValue(validateVoteChoice(input.choice));

  let suggestionBelongsToEvent = false;

  try {
    const [suggestion] = await getDb()
      .select({ id: dateSuggestions.id })
      .from(dateSuggestions)
      .innerJoin(events, eq(dateSuggestions.eventId, events.id))
      .where(
        and(
          eq(dateSuggestions.id, suggestionId),
          eq(dateSuggestions.eventId, eventId),
          isNull(events.deletedAt)
        )
      )
      .limit(1);

    suggestionBelongsToEvent = Boolean(suggestion);
  } catch (error) {
    throwDataError("verifying suggestion before saving vote", error);
  }

  if (!suggestionBelongsToEvent) {
    throw new Error("Datumförslaget hittades inte för den här planeringen.");
  }

  try {
    await getDb()
      .insert(votes)
      .values({
        suggestionId,
        voterName,
        choice
      })
      .onConflictDoUpdate({
        target: [votes.suggestionId, votes.voterName],
        set: { choice }
      });
  } catch (error) {
    throwDataError("submitting vote", error);
  }
}
