import assert from "node:assert/strict";
import test from "node:test";

import {
  SESSION_MAX_AGE_SECONDS,
  createAdminSessionValue,
  isValidAdminSessionValue
} from "./adminSession";

test("admin sessions are valid until they expire", () => {
  const now = Date.UTC(2026, 5, 16, 12, 0, 0);
  const value = createAdminSessionValue("secret", now);

  assert.equal(isValidAdminSessionValue(value, "secret", now), true);
  assert.equal(
    isValidAdminSessionValue(
      value,
      "secret",
      now + SESSION_MAX_AGE_SECONDS * 1000 - 1
    ),
    true
  );
  assert.equal(
    isValidAdminSessionValue(
      value,
      "secret",
      now + SESSION_MAX_AGE_SECONDS * 1000 + 1
    ),
    false
  );
});

test("admin sessions reject tampered signatures", () => {
  const value = createAdminSessionValue("secret", Date.UTC(2026, 5, 16));
  const tamperedValue = `${value}x`;

  assert.equal(isValidAdminSessionValue(tamperedValue, "secret"), false);
  assert.equal(isValidAdminSessionValue(value, "wrong-secret"), false);
});
