import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

test("landing page uses a small top-left header logo separate from the centered hero", () => {
  const source = readFileSync(resolve(process.cwd(), "src/app/page.tsx"), "utf8");

  assert.match(source, /items-center gap-5 py-4/);
  assert.match(source, /absolute left-4 top-4 z-10 sm:left-8 sm:top-6 lg:left-12 lg:top-8/);
  assert.match(source, /logoClassName="w-\[11rem\] sm:w-\[13rem\] lg:w-\[14rem\]"/);
});
