import test from "node:test";
import assert from "node:assert/strict";

import {
  getEventSearchCode,
  isEventSearchCode,
  isMemorableEventSearchCode
} from "./eventSearch";
import {
  generateMemorableEventSearchCode,
  getMemorableEventSearchCodeSpaceSize
} from "./memorableEventSearchCode";

test("generateMemorableEventSearchCode returns a memorable code with a two digit suffix", () => {
  const code = generateMemorableEventSearchCode();

  assert.match(code, /^[a-z]+-[a-z]+-\d{2}$/);
});

test("getMemorableEventSearchCodeSpaceSize reports the expanded search space", () => {
  assert.equal(getMemorableEventSearchCodeSpaceSize(), 1_000_000);
});

test("getEventSearchCode only returns stored search codes", () => {
  assert.equal(getEventSearchCode(null), undefined);
  assert.equal(
    getEventSearchCode("SASSY-PIGEON-36"),
    "sassy-pigeon-36"
  );
});

test("isEventSearchCode accepts only suffixed memorable codes", () => {
  assert.equal(isMemorableEventSearchCode("sassy-pigeon"), false);
  assert.equal(isMemorableEventSearchCode("sassy-pigeon-36"), true);
  assert.equal(isEventSearchCode("ABCDEF12"), false);
  assert.equal(isEventSearchCode("sassy-pigeon"), false);
  assert.equal(isEventSearchCode("sassy-pigeon-36"), true);
  assert.equal(isEventSearchCode("sassy-pigeon-360"), false);
});
