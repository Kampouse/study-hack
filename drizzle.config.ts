import { defineConfig } from "drizzle-kit";
import process from "process";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "sqlite",
  out: "./drizzle/migrations/",
  driver: "turso",
  dbCredentials: {
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
    url: process.env.PRIVATE_TURSO_DATABASE_URL || "local.db" ,
  },
});
