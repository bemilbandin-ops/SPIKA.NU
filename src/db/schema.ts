import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  pgTable,
  text,
  time,
  timestamp,
  unique,
  uuid
} from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    searchCode: text("search_code"),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true })
  },
  (table) => [
    check(
      "events_title_length_check",
      sql`char_length(${table.title}) between 1 and 120`
    ),
    check(
      "events_description_length_check",
      sql`${table.description} is null or char_length(${table.description}) <= 500`
    ),
    check(
      "events_search_code_format_check",
      sql`${table.searchCode} is null or ${table.searchCode} ~ '^[a-z]+-[a-z]+$'`
    ),
    index("events_created_at_idx").on(table.createdAt),
    index("events_deleted_at_idx").on(table.deletedAt),
    index("events_search_code_idx").on(table.searchCode),
    unique("events_search_code_unique").on(table.searchCode)
  ]
);

export const dateSuggestions = pgTable(
  "date_suggestions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    time: time("time"),
    suggestedBy: text("suggested_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      "date_suggestions_suggested_by_length_check",
      sql`char_length(${table.suggestedBy}) between 1 and 80`
    ),
    index("date_suggestions_event_id_idx").on(table.eventId),
    index("date_suggestions_date_idx").on(table.date)
  ]
);

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    suggestionId: uuid("suggestion_id")
      .notNull()
      .references(() => dateSuggestions.id, { onDelete: "cascade" }),
    voterName: text("voter_name").notNull(),
    choice: text("choice").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      "votes_voter_name_length_check",
      sql`char_length(${table.voterName}) between 1 and 80`
    ),
    check("votes_choice_check", sql`${table.choice} in ('yes', 'maybe', 'no')`),
    unique("votes_suggestion_id_voter_name_unique").on(
      table.suggestionId,
      table.voterName
    ),
    index("votes_suggestion_id_idx").on(table.suggestionId)
  ]
);
