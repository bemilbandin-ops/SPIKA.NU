export type VoteChoice = "yes" | "maybe" | "no";

export type EventRecord = {
  id: string;
  search_code: string | null;
  title: string;
  description: string | null;
  created_at: Date;
  deleted_at: Date | null;
};

export type DateSuggestionRecord = {
  id: string;
  event_id: string;
  date: string;
  time: string | null;
  suggested_by: string;
  created_at: Date;
};

export type VoteRecord = {
  id: string;
  suggestion_id: string;
  voter_name: string;
  choice: VoteChoice;
  created_at: Date;
};
