"use client";

import { useEffect, useRef, useState } from "react";

type ShareLinkProps = {
  path: string;
  searchCode?: string;
};

export function ShareLink({ path, searchCode }: ShareLinkProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = new URL(path, window.location.origin).toString();
    }
  }, [path]);

  async function copyShareUrl() {
    const shareUrl = new URL(path, window.location.origin).toString();

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  return (
    <div className="ui-panel relative grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
      {searchCode ? (
        <span className="w-fit rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)] sm:absolute sm:right-3 sm:top-3">
          Sök-ID: {searchCode}
        </span>
      ) : null}
      <label className="ui-label sm:pr-28">
        <span className="grid leading-tight">
          <span>Dela den här</span>
          <span>privata planeringslänken</span>
        </span>
        <input
          ref={inputRef}
          readOnly
          defaultValue={path}
          className="ui-input text-base normal-case tracking-normal"
        />
      </label>
      <button
        type="button"
        onClick={copyShareUrl}
        className="ui-button ui-button-secondary mobile-full sm:w-fit"
      >
        {copied ? "Kopierad" : "Kopiera länk"}
      </button>
    </div>
  );
}
