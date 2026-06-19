import assert from "node:assert/strict";
import test from "node:test";

import { handleDigestCron } from "./route";

test("digest cron requires its bearer secret and returns processing results", async () => {
  process.env.CRON_SECRET = "secret";
  const url = "https://example.com/api/cron/notification-digests";

  assert.equal((await handleDigestCron(new Request(url))).status, 401);

  const request = new Request(url, {
    headers: { authorization: "Bearer secret" }
  });
  const response = await handleDigestCron(request, async () => ({
    attempted: 3,
    sent: 2
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { attempted: 3, sent: 2 });

  const originalError = console.error;
  console.error = () => {};
  try {
    assert.equal(
      (
        await handleDigestCron(request, async () => {
          throw new Error("boom");
        })
      ).status,
      500
    );
  } finally {
    console.error = originalError;
    delete process.env.CRON_SECRET;
  }
});
