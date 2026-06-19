import test from "node:test";
import assert from "node:assert/strict";

import {
  validateNotificationInterval,
  validateOptionalEmail,
  validateRequiredEmail
} from "./validation";

test("validateOptionalEmail accepts empty values", () => {
  assert.deepEqual(validateOptionalEmail(), { ok: true, value: null });
  assert.deepEqual(validateOptionalEmail(null), { ok: true, value: null });
  assert.deepEqual(validateOptionalEmail("  "), { ok: true, value: null });
});

test("validateRequiredEmail rejects an empty value", () => {
  assert.deepEqual(validateRequiredEmail("  "), {
    ok: false,
    error: "E-postadress krävs."
  });
});

test("email validation normalizes and rejects invalid addresses", () => {
  assert.deepEqual(validateOptionalEmail("  Person@Example.COM  "), {
    ok: true,
    value: "person@example.com"
  });
  assert.deepEqual(validateOptionalEmail("invalid"), {
    ok: false,
    error: "Ange en giltig e-postadress eller lämna fältet tomt."
  });
});

test("validateNotificationInterval accepts only 24, 48, or 72 hours", () => {
  for (const hours of [24, 48, 72]) {
    assert.deepEqual(validateNotificationInterval(String(hours)), {
      ok: true,
      value: hours
    });
  }

  for (const value of ["", "0", "12", "25", "96", "24 hours"]) {
    assert.deepEqual(validateNotificationInterval(value), {
      ok: false,
      error: "Välj 24, 48 eller 72 timmar."
    });
  }
});
