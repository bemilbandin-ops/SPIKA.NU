import type { VoteRecord } from "@/lib/types";

export function getVoteCounts(votes: VoteRecord[]): {
  yes: number;
  maybe: number;
  no: number;
} {
  return votes.reduce(
    (counts, vote) => {
      counts[vote.choice] += 1;
      return counts;
    },
    { yes: 0, maybe: 0, no: 0 }
  );
}

function getDateValue(suggestion: unknown): number {
  if (
    typeof suggestion === "object" &&
    suggestion !== null &&
    "date" in suggestion &&
    typeof suggestion.date === "string"
  ) {
    const timestamp = Date.parse(`${suggestion.date}T00:00:00.000Z`);
    return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
  }

  return Number.POSITIVE_INFINITY;
}

export function getSortedSuggestions<T extends { votes: VoteRecord[] }>(
  suggestions: T[]
): T[] {
  return [...suggestions].sort((a, b) => {
    const aCounts = getVoteCounts(a.votes);
    const bCounts = getVoteCounts(b.votes);
    const aTotal = a.votes.length;
    const bTotal = b.votes.length;

    return (
      bCounts.yes - aCounts.yes ||
      aCounts.no - bCounts.no ||
      bTotal - aTotal ||
      getDateValue(a) - getDateValue(b)
    );
  });
}
