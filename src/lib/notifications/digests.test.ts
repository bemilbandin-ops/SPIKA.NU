import assert from "node:assert/strict";
import test from "node:test";

import {
  buildNotificationDigest,
  isDigestDue,
  processDueSubscription,
  type DueSubscription
} from "./digests";

const activityAt = new Date("2026-06-19T12:00:00Z");
const subscription: DueSubscription = {
  id: "11111111-1111-4111-8111-111111111111",
  eventId: "22222222-2222-4222-8222-222222222222",
  email: "person@example.com",
  intervalHours: 24,
  lastDigestAt: new Date("2026-06-18T12:00:00Z"),
  lastSeenActivityAt: new Date("2026-06-18T13:00:00Z"),
  activityAt
};

test("digest due calculation handles unseen activity and 24/48/72-hour boundaries", () => {
  for (const intervalHours of [24, 48, 72]) {
    const lastDigestAt = new Date("2026-06-16T12:00:00Z");
    const boundary = new Date(
      lastDigestAt.getTime() + intervalHours * 60 * 60 * 1000
    );

    assert.equal(
      isDigestDue(
        { ...subscription, intervalHours, lastDigestAt },
        new Date(boundary.getTime() - 1)
      ),
      false
    );
    assert.equal(
      isDigestDue({ ...subscription, intervalHours, lastDigestAt }, boundary),
      true
    );
  }

  assert.equal(
    isDigestDue(
      { ...subscription, lastSeenActivityAt: activityAt },
      new Date("2026-06-20T12:00:00Z")
    ),
    false
  );
});

test("digest includes vote details and escapes dynamic HTML", () => {
  const digest = buildNotificationDigest(
    {
      id: subscription.eventId,
      search_code: "calm-fox-12",
      title: "<Plan & party>",
      description: null,
      created_at: new Date(),
      voting_closes_at: null,
      deleted_at: null,
      suggestions: [
        {
          id: "suggestion",
          event_id: subscription.eventId,
          date: "2026-06-20",
          time: "18:30",
          suggested_by: 'A "B"',
          created_at: new Date(),
          votes: [
            {
              id: "vote-1",
              suggestion_id: "suggestion",
              voter_name: "<Yes>",
              choice: "yes",
              created_at: new Date()
            },
            {
              id: "vote-2",
              suggestion_id: "suggestion",
              voter_name: "Maybe & Co",
              choice: "maybe",
              created_at: new Date()
            }
          ]
        }
      ]
    },
    "https://example.com/event/2",
    "https://example.com/notifications/unsubscribe/1"
  );

  assert.match(digest.text, /2026-06-20 18:30/);
  assert.match(digest.text, /Ja \(1\): <Yes>/);
  assert.match(digest.text, /Kanske \(1\): Maybe & Co/);
  assert.match(digest.text, /Nej \(0\): -/);
  assert.doesNotMatch(digest.html, /<Plan & party>|<Yes>/);
  assert.match(digest.html, /&lt;Plan &amp; party&gt;/);
  assert.match(digest.html, /A &quot;B&quot;/);
});

test("successful delivery advances both timestamps; failure advances neither", async () => {
  const event = {
    id: subscription.eventId,
    search_code: null,
    title: "Plan",
    description: null,
    created_at: new Date(),
    voting_closes_at: null,
    deleted_at: null,
    suggestions: []
  };

  for (const delivered of [false, true]) {
    let updated:
      | { id: string; lastDigestAt: Date; lastSeenActivityAt: Date }
      | undefined;

    const sent = await processDueSubscription(subscription, {
      getEvent: async () => event,
      sendEmail: async () => delivered,
      updateTimestamps: async (value) => {
        updated = value;
      },
      now: () => new Date("2026-06-19T13:00:00Z"),
      absoluteUrl: (path) => `https://example.com${path}`
    });

    assert.equal(sent, delivered);
    assert.equal(updated?.lastSeenActivityAt, delivered ? activityAt : undefined);
    assert.equal(
      updated?.lastDigestAt.toISOString(),
      delivered ? "2026-06-19T13:00:00.000Z" : undefined
    );
  }
});
