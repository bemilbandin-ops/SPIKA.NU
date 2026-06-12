import "server-only";

import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { dateSuggestions, events, votes } from "@/db/schema";
import { isEventSearchCode } from "@/lib/eventSearch";
import type {
  DateSuggestionRecord,
  EventRecord,
  VoteChoice,
  VoteRecord
} from "@/lib/types";
import { getSortedSuggestions } from "@/lib/utils";
import {
  getValidatedValue,
  validateDate,
  validateEventDescription,
  validateEventTitle,
  validateName,
  validateTime,
  validateUuid
} from "@/lib/validation";

type VoteRow = Omit<VoteRecord, "choice"> & {
  choice: string;
};

export type SuggestionWithVotes = DateSuggestionRecord & {
  votes: VoteRecord[];
};

export type EventWithSuggestions = EventRecord & {
  suggestions: SuggestionWithVotes[];
};

const eventSelection = {
  id: events.id,
  title: events.title,
  description: events.description,
  created_at: events.createdAt,
  deleted_at: events.deletedAt
};

const suggestionSelection = {
  id: dateSuggestions.id,
  event_id: dateSuggestions.eventId,
  date: dateSuggestions.date,
  time: dateSuggestions.time,
  suggested_by: dateSuggestions.suggestedBy,
  created_at: dateSuggestions.createdAt
};

const voteSelection = {
  id: votes.id,
  suggestion_id: votes.suggestionId,
  voter_name: votes.voterName,
  choice: votes.choice,
  created_at: votes.createdAt
};

function toVoteRecord(row: VoteRow): VoteRecord {
  return {
    ...row,
    choice: row.choice as VoteChoice
  };
}

function throwDataError(action: string, error: unknown): never {
  console.error(`Database error while ${action}.`, {
    message: error instanceof Error ? error.message : String(error)
  });

  throw new Error("Något gick fel när planeringsdata skulle sparas.");
}

export async function findEventIdBySearchCode(
  searchCode: string
): Promise<string | null> {
  const code = searchCode.trim().toLowerCase();

  if (!isEventSearchCode(code)) {
    throw new Error("Ange ett planerings-ID med 8 tecken.");
  }

  try {
    const matches = await getDb()
      .select({ id: events.id })
      .from(events)
      .where(
        and(
          sql`left(${events.id}::text, 8) = ${code}`,
          isNull(events.deletedAt)
        )
      )
      .limit(2);

    if (matches.length > 1) {
      throw new Error(
        "Sök-ID:t matchar fler än en planering. Använd den fullständiga planerings-URL:en."
      );
    }

    return matches[0]?.id ?? null;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Sök-ID")) {
      throw error;
    }

    throwDataError("searching events", error);
  }
}

export async function createEvent(input: {
  title: string;
  description?: string | null;
  creatorName: string;
  suggestedDate: string;
  suggestedTime: string;
}): Promise<{ id: string }> {
  const title = getValidatedValue(validateEventTitle(input.title));
  const description = getValidatedValue(
    validateEventDescription(input.description)
  );
  const creatorName = getValidatedValue(validateName(input.creatorName));
  const suggestedDate = getValidatedValue(validateDate(input.suggestedDate));
  const suggestedTime = getValidatedValue(validateTime(input.suggestedTime));

  if (!suggestedTime) {
    throw new Error("Tid krävs.");
  }

  try {
    const createdEvent = await getDb().transaction(async (tx) => {
      const [event] = await tx
        .insert(events)
        .values({ title, description })
        .returning({ id: events.id });

      if (!event) {
        throw new Error("Inget planerings-ID returnerades efter sparning.");
      }

      await tx.insert(dateSuggestions).values({
        eventId: event.id,
        date: suggestedDate,
        time: suggestedTime,
        suggestedBy: creatorName
      });

      return event;
    });

    return createdEvent;
  } catch (error) {
    throwDataError("creating event", error);
  }
}

export async function getEventById(
  id: string
): Promise<EventWithSuggestions | null> {
  const eventId = getValidatedValue(validateUuid(id, "Planerings-ID"));

  try {
    const [event] = await getDb()
      .select(eventSelection)
      .from(events)
      .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
      .limit(1);

    if (!event) {
      return null;
    }

    const suggestions = await getDb()
      .select(suggestionSelection)
      .from(dateSuggestions)
      .where(eq(dateSuggestions.eventId, eventId));

    const suggestionIds = suggestions.map((suggestion) => suggestion.id);
    const voteRows = suggestionIds.length
      ? await getDb()
          .select(voteSelection)
          .from(votes)
          .where(inArray(votes.suggestionId, suggestionIds))
      : [];
    const votesBySuggestionId = new Map<string, VoteRecord[]>();

    for (const vote of voteRows.map(toVoteRecord)) {
      const existingVotes = votesBySuggestionId.get(vote.suggestion_id) ?? [];
      existingVotes.push(vote);
      votesBySuggestionId.set(vote.suggestion_id, existingVotes);
    }

    return {
      ...event,
      suggestions: getSortedSuggestions(
        suggestions.map((suggestion) => ({
          ...suggestion,
          votes: votesBySuggestionId.get(suggestion.id) ?? []
        }))
      )
    };
  } catch (error) {
    throwDataError("loading event", error);
  }
}

export async function softDeleteEvent(id: string): Promise<void> {
  const eventId = getValidatedValue(validateUuid(id, "Planerings-ID"));

  try {
    await getDb()
      .update(events)
      .set({ deletedAt: new Date() })
      .where(eq(events.id, eventId));
  } catch (error) {
    throwDataError("deleting event", error);
  }
}

export async function listRecentEventsForAdmin(): Promise<EventRecord[]> {
  try {
    return await getDb()
      .select(eventSelection)
      .from(events)
      .where(isNull(events.deletedAt))
      .orderBy(desc(events.createdAt))
      .limit(50);
  } catch (error) {
    throwDataError("listing recent admin events", error);
  }
}
