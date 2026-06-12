type RequiredEnvKey =
  | "NEXT_PUBLIC_SITE_URL"
  | "DATABASE_URL"
  | "ADMIN_PASSWORD"
  | "ADMIN_SESSION_SECRET";

function getRequiredEnv(name: RequiredEnvKey): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getRequiredServerEnv(
  name: Exclude<RequiredEnvKey, "NEXT_PUBLIC_SITE_URL">
): string {
  if (typeof window !== "undefined") {
    throw new Error(`${name} is server-only and cannot be read in the browser`);
  }

  return getRequiredEnv(name);
}

export function getSiteUrl() {
  return getRequiredEnv("NEXT_PUBLIC_SITE_URL");
}

export function getDatabaseUrl() {
  return getRequiredServerEnv("DATABASE_URL");
}

export function getAdminPassword() {
  return getRequiredServerEnv("ADMIN_PASSWORD");
}

export function getAdminSessionSecret() {
  return getRequiredServerEnv("ADMIN_SESSION_SECRET");
}
