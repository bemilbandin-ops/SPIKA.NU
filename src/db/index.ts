import "server-only";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import { getDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

let client: Sql | null = null;
let db: PostgresJsDatabase<typeof schema> | null = null;

export function getDb() {
  if (!db) {
    client = postgres(getDatabaseUrl(), { prepare: false });
    db = drizzle(client, { schema });
  }

  return db;
}
