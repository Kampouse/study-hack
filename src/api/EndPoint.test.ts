import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as Schema from "~/../drizzle/schema";
import Database from "better-sqlite3";
import { CreateUser } from "./Query";

const sqlite = new Database(":memory:");
const db = drizzle(sqlite, {
  schema: Schema,
});

async function runMigration() {
  migrate(db, { migrationsFolder: "./drizzle/drizzle/migrations" });
}

runMigration().catch(console.error);

// Get all table names from the database

const newUser = {
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg",
};

await CreateUser({
  event: undefined,
  session: {
    name: "test",
    user: newUser,
  },
  client: db as any,
});
await db.select().from(Schema.Users);
