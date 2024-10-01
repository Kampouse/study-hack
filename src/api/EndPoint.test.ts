import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as Schema from "~/../drizzle/schema";
import Database from "better-sqlite3";
import { InjecatbleSeedScript } from "../../drizzle/seed";
const sqlite = new Database(":memory:");
const db = drizzle(sqlite, {
  schema: Schema,
});
async function runMigration() {
  migrate(db, { migrationsFolder: "./drizzle/drizzle/migrations" });
}
runMigration().catch(console.error);
await InjecatbleSeedScript(db as any)
