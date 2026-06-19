const STOCKHOLM_TIME_ZONE = "Europe/Stockholm";
const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d)$/;

const stockholmPartsFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: STOCKHOLM_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
});

const stockholmDateFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: STOCKHOLM_TIME_ZONE,
  dateStyle: "full"
});

const stockholmTimeFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: STOCKHOLM_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
});

function getStockholmLocalValue(date: Date): string {
  const parts = Object.fromEntries(
    stockholmPartsFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value])
  );

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function parseVotingDeadline(
  value: string,
  now = new Date()
): Date | null {
  const localValue = value.trim();
  if (!localValue) return null;

  const match = LOCAL_DATE_TIME_PATTERN.exec(localValue);
  if (!match) {
    throw new Error("Ange ett giltigt datum och klockslag för röstningen.");
  }

  const [, year, month, day, hour, minute] = match;
  const localAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );
  const normalized = new Date(localAsUtc).toISOString();

  if (
    normalized.slice(0, 10) !== `${year}-${month}-${day}` ||
    normalized.slice(11, 16) !== `${hour}:${minute}`
  ) {
    throw new Error("Ange ett giltigt datum och klockslag för röstningen.");
  }

  let deadline: Date | null = null;

  for (
    let candidate = localAsUtc - 3 * 60 * 60 * 1000;
    candidate <= localAsUtc + 3 * 60 * 60 * 1000;
    candidate += 60 * 1000
  ) {
    const date = new Date(candidate);
    if (getStockholmLocalValue(date) === localValue) {
      deadline = date;
      break;
    }
  }

  if (!deadline) {
    throw new Error("Klockslaget finns inte i svensk lokal tid.");
  }

  if (deadline.getTime() <= now.getTime()) {
    throw new Error("Sista tiden för röstning måste ligga i framtiden.");
  }

  return deadline;
}

export function isVotingClosed(
  deadline: Date | null,
  now = new Date()
): boolean {
  return deadline !== null && now.getTime() >= deadline.getTime();
}

export function formatVotingDeadline(deadline: Date): string {
  return `${stockholmDateFormatter.format(deadline)} kl. ${stockholmTimeFormatter.format(deadline)}`;
}
