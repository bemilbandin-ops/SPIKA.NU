import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { dateSuggestions, events, votes } from "@/db/schema";
import type { VoteChoice } from "@/lib/types";
import {
  getValidatedValue,
  validateName,
  validateUuid,
  validateVoteChoice
} from "@/lib/validation";
import { isVotingClosed } from "@/lib/votingDeadline";

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

  try {
    await getDb().transaction(async (tx) => {
      const [suggestion] = await tx
        .select({
          id: dateSuggestions.id,
          votingClosesAt: events.votingClosesAt
        })
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

      if (!suggestion) {
        throw new Error("Datumförslaget hittades inte för den här planeringen.");
      }

      if (isVotingClosed(suggestion.votingClosesAt)) {
        throw new Error("Röstningen är stängd.");
      }

      await tx
        .insert(votes)
        .values({ suggestionId, voterName, choice })
        .onConflictDoUpdate({
          target: [votes.suggestionId, votes.voterName],
          set: { choice }
        });

      await tx
        .update(events)
        .set({ notificationActivityAt: sql`now()` })
        .where(eq(events.id, eventId));
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Röstningen är stängd.") {
      throw error;
    }

    throwDataError("submitting vote", error);
  }
}
