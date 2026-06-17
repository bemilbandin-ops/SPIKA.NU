import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { BrandHeader } from "./BrandHeader";

test("BrandHeader renders a clickable home logo", () => {
  const markup = renderToStaticMarkup(BrandHeader({}));

  assert.match(markup, /href="\/"/);
  assert.match(markup, /aria-label="Gå till startsidan"/);
  assert.doesNotMatch(markup, /site-background/);
  assert.match(markup, /class="[^"]*w-\[20rem\][^"]*sm:w-\[24rem\][^"]*"/);
  assert.match(markup, /src="\/pickaday-logo\.png"/);
  assert.match(markup, /alt="PickADay"/);
});
