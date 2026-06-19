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

export function getSortedSuggestions<
  T extends { date: string; time: string | null; votes: VoteRecord[] }
>(
  suggestions: T[]
): T[] {
  return [...suggestions].sort((a, b) => {
    const timeA = a.time ?? "99:99";
    const timeB = b.time ?? "99:99";
    return a.date.localeCompare(b.date) || timeA.localeCompare(timeB);
  });
}
