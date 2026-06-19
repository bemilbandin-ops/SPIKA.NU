import assert from "node:assert/strict";
import test from "node:test";

import { getSortedSuggestions } from "@/lib/utils";
import type { VoteRecord } from "@/lib/types";

const votes: VoteRecord[] = [];

test("sorts suggestions by date, then time, with missing times last", () => {
  const suggestions = [
    { id: "untimed", date: "2026-06-20", time: null, votes },
    { id: "later", date: "2026-06-21", time: "08:00", votes },
    { id: "afternoon", date: "2026-06-20", time: "14:00", votes },
    { id: "morning", date: "2026-06-20", time: "09:00", votes }
  ];

  assert.deepEqual(
    getSortedSuggestions(suggestions).map(({ id }) => id),
    ["morning", "afternoon", "untimed", "later"]
  );
});

test("keeps equal date and time values stable", () => {
  const suggestions = [
    { id: "first", date: "2026-06-20", time: "09:00", votes },
    { id: "second", date: "2026-06-20", time: "09:00", votes }
  ];

  assert.deepEqual(
    getSortedSuggestions(suggestions).map(({ id }) => id),
    ["first", "second"]
  );
});
