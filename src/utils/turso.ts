import process from "process";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
export function tursoClient() {
  const url = process.env.PRIVATE_TURSO_DATABASE_URL;
  if (url?.includes("local")) {
    return drizzle(
      createClient({
        url: "file:./local.db",
      }),
    );
  }
  if (url === undefined) {
    throw new Error("PRIVATE_TURSO_DATABASE_URL is not defined");
  }

  const authToken = process.env.PRIVATE_TURSO_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    if (!url.includes("file:")) {
      throw new Error("PRIVATE_TURSO_AUTH_TOKEN is not defined");
    }
  }

  const db = drizzle(
    createClient({
      authToken: authToken,
      url: url,
    }),
  );
  return db;
}
