import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

test("landing hero keeps the original centered layout while only lifting the logo", () => {
  const source = readFileSync(resolve(process.cwd(), "src/app/page.tsx"), "utf8");

  assert.match(source, /items-center gap-5 py-4/);
  assert.match(source, /sm:relative sm:-top-20 sm:mb-3 lg:-top-24/);
});
