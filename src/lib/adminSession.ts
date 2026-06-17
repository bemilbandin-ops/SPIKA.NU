import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const SESSION_MAX_AGE_MILLISECONDS = SESSION_MAX_AGE_SECONDS * 1000;

type AdminSessionPayload = {
  sub: "admin";
  iat: number;
  exp: number;
};

function timingSafeStringEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left, "utf8").digest();
  const rightHash = createHash("sha256").update(right, "utf8").digest();

  return timingSafeEqual(leftHash, rightHash);
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function isAdminSessionPayload(value: unknown): value is AdminSessionPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    candidate.sub === "admin" &&
    typeof candidate.iat === "number" &&
    Number.isFinite(candidate.iat) &&
    typeof candidate.exp === "number" &&
    Number.isFinite(candidate.exp)
  );
}

export function createAdminSessionValue(
  secret: string,
  now = Date.now()
): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: "admin",
      iat: now,
      exp: now + SESSION_MAX_AGE_MILLISECONDS
    } satisfies AdminSessionPayload),
    "utf8"
  ).toString("base64url");
  const signature = signPayload(payload, secret);

  return `${payload}.${signature}`;
}

export function isValidAdminSessionValue(
  value: string | undefined,
  secret: string,
  now = Date.now()
): boolean {
  if (!value) {
    return false;
  }

  const [payload, signature, extra] = value.split(".");

  if (!payload || !signature || extra) {
    return false;
  }

  const expectedSignature = signPayload(payload, secret);

  if (!timingSafeStringEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    ) as unknown;

    if (!isAdminSessionPayload(session)) {
      return false;
    }

    if (session.iat > session.exp) {
      return false;
    }

    if (session.exp - session.iat > SESSION_MAX_AGE_MILLISECONDS) {
      return false;
    }

    return session.exp >= now;
  } catch {
    return false;
  }
}
