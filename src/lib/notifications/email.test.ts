import assert from "node:assert/strict";
import test from "node:test";

import { getAbsoluteUrl, sendNotificationEmail } from "./email";

test("getAbsoluteUrl accepts HTTP(S) configuration only", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/base";
  assert.equal(getAbsoluteUrl("/event/1"), "https://example.com/event/1");

  process.env.NEXT_PUBLIC_SITE_URL = "ftp://example.com";
  assert.equal(getAbsoluteUrl("/event/1"), null);

  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal(getAbsoluteUrl("/event/1"), null);
});

test("sendNotificationEmail handles configuration and HTTP results", async () => {
  const originalFetch = globalThis.fetch;
  const input = {
    to: "person@example.com",
    subject: "Subject",
    text: "Text",
    html: "<p>HTML</p>"
  };

  try {
    delete process.env.RESEND_API_KEY;
    delete process.env.NOTIFICATION_FROM_EMAIL;
    assert.equal(await sendNotificationEmail(input), false);

    process.env.RESEND_API_KEY = "secret";
    process.env.NOTIFICATION_FROM_EMAIL = "Sender <sender@example.com>";

    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(init?.method, "POST");
      assert.equal(
        (init?.headers as Record<string, string>).Authorization,
        "Bearer secret"
      );
      assert.deepEqual(JSON.parse(String(init?.body)), {
        from: "Sender <sender@example.com>",
        to: ["person@example.com"],
        subject: "Subject",
        text: "Text",
        html: "<p>HTML</p>"
      });
      return new Response(null, { status: 200 });
    };
    assert.equal(await sendNotificationEmail(input), true);

    globalThis.fetch = async () => new Response("bad", { status: 400 });
    assert.equal(await sendNotificationEmail(input), false);

    globalThis.fetch = async () => {
      throw new Error("network");
    };
    assert.equal(await sendNotificationEmail(input), false);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.RESEND_API_KEY;
    delete process.env.NOTIFICATION_FROM_EMAIL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  }
});
