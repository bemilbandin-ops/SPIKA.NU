import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const FILES_WITH_SWEDISH_COPY = [
  "src/lib/data/events.ts",
  "src/lib/memorableEventSearchCode.ts"
];

test("Swedish copy does not contain mojibake sequences", () => {
  for (const relativePath of FILES_WITH_SWEDISH_COPY) {
    const content = readFileSync(resolve(process.cwd(), relativePath), "utf8");

    assert.equal(content.includes("Ã"), false, `${relativePath} contains Ã`);
    assert.equal(content.includes("Â"), false, `${relativePath} contains Â`);
  }
});
