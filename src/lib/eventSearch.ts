const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LEGACY_SEARCH_CODE_PATTERN = /^[0-9a-f]{8}$/i;
const MEMORABLE_SEARCH_CODE_PATTERN = /^[a-z]+-[a-z]+$/i;

export function getEventSearchCode(
  eventId: string,
  searchCode?: string | null
): string {
  return searchCode?.toLowerCase() ?? eventId.slice(0, 8).toUpperCase();
}

export function normalizeEventSearchInput(value: string): string {
  const trimmed = value.trim();
  const eventPathMatch = trimmed.match(
    /\/event\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );

  if (eventPathMatch) {
    return eventPathMatch[1].toLowerCase();
  }

  return trimmed.replace(/^\/+|\/+$/g, "").toLowerCase();
}

export function isEventUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function isEventSearchCode(value: string): boolean {
  return (
    LEGACY_SEARCH_CODE_PATTERN.test(value) ||
    MEMORABLE_SEARCH_CODE_PATTERN.test(value)
  );
}

export function isLegacyEventSearchCode(value: string): boolean {
  return LEGACY_SEARCH_CODE_PATTERN.test(value);
}

export function isMemorableEventSearchCode(value: string): boolean {
  return MEMORABLE_SEARCH_CODE_PATTERN.test(value);
}
