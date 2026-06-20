# Voting deadline

## Scope

Event creators may optionally set **Sista dagen för röstning** while creating
an event. The value includes date and time and is interpreted in
`Europe/Stockholm`, including daylight-saving changes.

## Data and validation

- Add nullable `events.voting_closes_at` as a timezone-aware timestamp.
- Accept the value from a native `datetime-local` input.
- Convert it from Stockholm local time to an exact timestamp before storage.
- Reject invalid or non-existent local times and deadlines that are not in the
  future.
- If a clock time occurs twice when daylight saving ends, use its first
  occurrence.
- Existing events and newly created events without a deadline remain open.

## Behaviour

- At and after `voting_closes_at`, the server rejects new or changed votes and
  new date suggestions.
- Server checks are authoritative even if a stale page still shows a form.
- The event page hides vote and suggestion forms after closing and shows
  `Röstningen är stängd`.

## Presentation

- Under the existing `Skapat av …` text, show
  `Röstningen stänger [svenskt datum] kl. HH:mm`.
- Use the same font and size as the creator text.
- Show no deadline text when the event has no deadline.

## Testing

- Unit-test Stockholm local-time parsing, including daylight-saving edge cases.
- Unit-test the shared open/closed decision used by vote and suggestion writes.
- Run lint, typecheck, tests, and production build.
