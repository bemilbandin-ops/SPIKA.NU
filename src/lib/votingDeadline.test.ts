import assert from "node:assert/strict";
import test from "node:test";

import {
  formatVotingDeadline,
  isVotingClosed,
  parseVotingDeadline
} from "./votingDeadline";

const now = new Date("2026-01-01T00:00:00.000Z");

test("parses optional Stockholm local deadlines", () => {
  assert.equal(parseVotingDeadline("", now), null);
  assert.equal(
    parseVotingDeadline("2026-06-20T14:30", now)?.toISOString(),
    "2026-06-20T12:30:00.000Z"
  );
  assert.equal(
    parseVotingDeadline("2026-10-25T02:30", now)?.toISOString(),
    "2026-10-25T00:30:00.000Z"
  );
});

test("rejects invalid, non-existent, and past deadlines", () => {
  for (const value of [
    "invalid",
    "2026-02-30T12:00",
    "2026-03-29T02:30",
    "2025-12-31T23:59"
  ]) {
    assert.throws(() => parseVotingDeadline(value, now));
  }
});

test("closes voting exactly at the deadline", () => {
  const deadline = new Date("2026-06-20T12:30:00.000Z");

  assert.equal(
    isVotingClosed(deadline, new Date("2026-06-20T12:29:59.999Z")),
    false
  );
  assert.equal(isVotingClosed(deadline, deadline), true);
  assert.equal(isVotingClosed(null, deadline), false);
});

test("formats deadlines in Swedish local time", () => {
  assert.equal(
    formatVotingDeadline(new Date("2026-06-20T12:30:00.000Z")),
    "lördag 20 juni 2026 kl. 14:30"
  );
});
