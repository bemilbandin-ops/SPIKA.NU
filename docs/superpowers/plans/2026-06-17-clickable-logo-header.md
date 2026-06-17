# Clickable Logo Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visible `PickADay` text header on the landing page and event page with the provided logo image, and make that logo link back to `/`.

**Architecture:** Add one shared `BrandHeader` component that renders a home link plus the logo image from a public asset path. Reuse that component in the landing hero and event page header so both pages share the same accessibility and sizing behavior.

**Tech Stack:** Next.js app router, React 19, Tailwind CSS, Node test runner with `tsx`

---

### Task 1: Add regression coverage for the shared brand header

**Files:**
- Create: `src/components/BrandHeader.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { BrandHeader } from "./BrandHeader";

test("BrandHeader renders a clickable home logo", () => {
  const markup = renderToStaticMarkup(BrandHeader({}));

  assert.match(markup, /href="\/"/);
  assert.match(markup, /aria-label="Gå till startsidan"/);
  assert.match(markup, /src="\/pickaday-logo\.png"/);
  assert.match(markup, /alt="PickADay"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/BrandHeader.test.ts`
Expected: FAIL because `./BrandHeader` does not exist yet

- [ ] **Step 3: Write minimal implementation**

```tsx
import Link from "next/link";

type BrandHeaderProps = {
  className?: string;
  logoClassName?: string;
};

export function BrandHeader({
  className,
  logoClassName = "w-[10rem] sm:w-[12rem]"
}: BrandHeaderProps) {
  return (
    <Link
      href="/"
      aria-label="Gå till startsidan"
      className={["inline-flex w-fit", className].filter(Boolean).join(" ")}
    >
      <img
        alt="PickADay"
        src="/pickaday-logo.png"
        className={["h-auto", logoClassName].join(" ")}
      />
      <span className="sr-only">PickADay startsida</span>
    </Link>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test src/components/BrandHeader.test.ts`
Expected: PASS

### Task 2: Reuse the shared header on the landing and event pages

**Files:**
- Create: `public/pickaday-logo.png`
- Create: `src/components/BrandHeader.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/event/[id]/page.tsx`

- [ ] **Step 1: Copy the provided asset into the public directory**

Run: `New-Item -ItemType Directory -Force public; Copy-Item -LiteralPath 'docs/PickADay-logo.png' -Destination 'public/pickaday-logo.png' -Force`
Expected: `public/pickaday-logo.png` exists

- [ ] **Step 2: Add the shared component and replace the text headers**

```tsx
// src/components/BrandHeader.tsx
import Link from "next/link";

type BrandHeaderProps = {
  className?: string;
  logoClassName?: string;
};

export function BrandHeader({
  className,
  logoClassName = "w-[10rem] sm:w-[12rem]"
}: BrandHeaderProps) {
  return (
    <Link
      href="/"
      aria-label="Gå till startsidan"
      className={["inline-flex w-fit", className].filter(Boolean).join(" ")}
    >
      <img
        alt="PickADay"
        src="/pickaday-logo.png"
        className={["h-auto", logoClassName].join(" ")}
      />
      <span className="sr-only">PickADay startsida</span>
    </Link>
  );
}
```

```tsx
// src/app/page.tsx
import { BrandHeader } from "@/components/BrandHeader";

<BrandHeader logoClassName="w-[10.5rem] sm:w-[13rem] lg:w-[14rem]" />
```

```tsx
// src/app/event/[id]/page.tsx
import { BrandHeader } from "@/components/BrandHeader";

<BrandHeader logoClassName="w-[9rem] sm:w-[10.5rem]" />
```

- [ ] **Step 3: Run focused verification**

Run: `npx tsx --test src/components/BrandHeader.test.ts`
Expected: PASS

### Task 3: Run project verification

**Files:**
- Verify only

- [ ] **Step 1: Run type checking**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: PASS
