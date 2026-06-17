import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { getAdminPassword, getAdminSessionSecret } from "@/lib/env";
import {
  SESSION_MAX_AGE_SECONDS,
  createAdminSessionValue,
  isValidAdminSessionValue
} from "@/lib/adminSession";

const ADMIN_SESSION_COOKIE = "spika_admin_session";

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

function createSessionValue(): string | null {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  return createAdminSessionValue(secret);
}

function isValidSessionValue(value: string | undefined): boolean {
  const secret = getSessionSecret();

  if (!secret) {
    return false;
  }

  return isValidAdminSessionValue(value, secret);
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
