import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { getAdminPassword, getAdminSessionSecret } from "@/lib/env";

const ADMIN_SESSION_COOKIE = "spika_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function logAdminAuthError(message: string, error: unknown) {
  console.error(message, {
    message: error instanceof Error ? error.message : String(error)
  });
}

function getSessionSecret(): string | null {
  try {
    return getAdminSessionSecret();
  } catch (error) {
    logAdminAuthError("Admin session secret is not configured.", error);
    return null;
  }
}

function getStoredAdminPassword(): string | null {
  try {
    return getAdminPassword();
  } catch (error) {
    logAdminAuthError("Admin password is not configured.", error);
    return null;
  }
}

function timingSafeStringEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left, "utf8").digest();
  const rightHash = createHash("sha256").update(right, "utf8").digest();

  return timingSafeEqual(leftHash, rightHash);
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionValue(): string | null {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", iat: Date.now() }),
    "utf8"
  ).toString("base64url");
  const signature = signPayload(payload, secret);

  return `${payload}.${signature}`;
}

function isValidSessionValue(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const [payload, signature, extra] = value.split(".");

  if (!payload || !signature || extra) {
    return false;
  }

  const secret = getSessionSecret();

  if (!secret) {
    return false;
  }

  const expectedSignature = signPayload(payload, secret);

  if (!timingSafeStringEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString());
    return session?.sub === "admin";
  } catch {
    return false;
  }
}

export function isCorrectAdminPassword(password: string): boolean {
  const storedPassword = getStoredAdminPassword();

  if (!storedPassword) {
    return false;
  }

  return timingSafeStringEqual(password, storedPassword);
}

export async function hasValidAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return isValidSessionValue(value);
}

export async function setAdminSessionCookie(): Promise<boolean> {
  const value = createSessionValue();

  if (!value) {
    return false;
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return true;
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
