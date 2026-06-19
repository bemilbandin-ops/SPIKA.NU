import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

test("notification signup silently ignores bots that fill the honeypot", () => {
  const form = readFileSync(
    resolve(process.cwd(), "src/components/NotificationSignupForm.tsx"),
    "utf8"
  );
  const action = readFileSync(
    resolve(process.cwd(), "src/app/event/[id]/actions.ts"),
    "utf8"
  );

  assert.match(form, /name="companyWebsite"/);
  assert.match(form, /tabIndex=\{-1\}/);
  assert.match(form, /autoComplete="off"/);
  assert.match(form, /aria-hidden="true"/);
  assert.match(action, /readString\(formData, "companyWebsite"\)/);
});
