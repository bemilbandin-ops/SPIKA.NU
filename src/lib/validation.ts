import type { VoteChoice } from "@/lib/types";
import { getAllowedDateRange } from "@/lib/dateLimits";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NotificationIntervalHours = 24 | 48 | 72;

function ok<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

function error(message: string): ValidationResult<never> {
  return { ok: false, error: message };
}

export function getValidatedValue<T>(result: ValidationResult<T>): T {
  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.value;
}

export function validateEventTitle(value: string): ValidationResult<string> {
  const title = value.trim();

  if (!title) {
    return error("Titel krävs.");
  }

  if (title.length > 120) {
    return error("Titeln får vara högst 120 tecken.");
  }

  return ok(title);
}

export function validateEventDescription(
  value?: string | null
): ValidationResult<string | null> {
  if (value == null) {
    return ok(null);
  }

  const description = value.trim();

  if (!description) {
    return ok(null);
  }

  if (description.length > 500) {
    return error("Beskrivningen får vara högst 500 tecken.");
  }

  return ok(description);
}

export function validateName(value: string): ValidationResult<string> {
  const name = value.trim();

  if (!name) {
    return error("Namn krävs.");
  }

  if (name.length > 80) {
    return error("Namnet får vara högst 80 tecken.");
  }

  return ok(name);
}

export function validateDate(value: string): ValidationResult<string> {
  const date = value.trim();

  if (!date) {
    return error("Datum krävs.");
  }

  if (!DATE_PATTERN.test(date)) {
    return error("Datum måste anges i formatet ÅÅÅÅ-MM-DD.");
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    return error("Datumet måste vara ett giltigt kalenderdatum.");
  }

  const { min, max } = getAllowedDateRange();

  if (date < min) {
    return error("Datumet kan inte vara i det förflutna.");
  }

  if (date > max) {
    return error("Maxgränsen är 1 år.");
  }

  return ok(date);
}

export function validateTime(
  value?: string | null
): ValidationResult<string | null> {
  if (value == null) {
    return ok(null);
  }

  const time = value.trim();

  if (!time) {
    return ok(null);
  }

  if (!TIME_PATTERN.test(time)) {
    return error("Tid måste anges i formatet HH:mm.");
  }

  return ok(time);
}

export function validateVoteChoice(value: string): ValidationResult<VoteChoice> {
  if (value === "yes" || value === "maybe" || value === "no") {
    return ok(value);
  }

  return error("Rösten måste vara ja, kanske eller nej.");
}

export function validateOptionalEmail(
  value?: string | null
): ValidationResult<string | null> {
  if (value == null) return ok(null);

  const email = value.trim().toLowerCase();
  if (!email) return ok(null);

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return error("Ange en giltig e-postadress eller lämna fältet tomt.");
  }

  return ok(email);
}

export function validateRequiredEmail(value: string): ValidationResult<string> {
  const result = validateOptionalEmail(value);
  if (!result.ok) return result;
  return result.value
    ? ok(result.value)
    : error("E-postadress krävs.");
}

export function validateNotificationInterval(
  value: string
): ValidationResult<NotificationIntervalHours> {
  const hours = Number(value);
  return hours === 24 || hours === 48 || hours === 72
    ? ok(hours)
    : error("Välj 24, 48 eller 72 timmar.");
}

export function validateUuid(
  value: string,
  label = "ID"
): ValidationResult<string> {
  const id = value.trim();

  if (!id) {
    return error(`${label} krävs.`);
  }

  if (!UUID_PATTERN.test(id)) {
    return error(`${label} måste vara ett giltigt UUID.`);
  }

  return ok(id);
}
