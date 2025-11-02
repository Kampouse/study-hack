import Database from "better-sqlite3";
import { sql } from "drizzle-orm";
import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { afterEach, beforeEach } from "vitest";
import * as schema from "../drizzle/schema";
import path from "node:path";

/**
 * Global test database instance
 * Each test gets a fresh in-memory database
 */
export let testDb: BetterSQLite3Database<typeof schema>;
export let sqlite: Database.Database;

/**
 * Create a fresh in-memory SQLite database with schema
 */
export function createTestDatabase(): BetterSQLite3Database<typeof schema> {
  // Create in-memory SQLite database
  sqlite = new Database(":memory:");
  testDb = drizzle(sqlite, { schema });

  // Run migrations using Drizzle
  // This will create all tables from the schema
  migrate(testDb, {
    migrationsFolder: path.join(process.cwd(), "drizzle/migrations"),
  });

  return testDb;
}

/**
 * Clean up database after test
 */
export function cleanupTestDatabase(): void {
  if (sqlite) {
    sqlite.close();
  }
}

/**
 * Setup: Create fresh database before each test
 */
beforeEach((): void => {
  createTestDatabase();
});

/**
 * Teardown: Clean up database after each test
 */
afterEach((): void => {
  cleanupTestDatabase();
});

/**
 * Helper: Get current timestamp in SQLite format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Helper: Get future date (for events)
 */
export function getFutureDate(daysAhead = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split("T")[0];
}

/**
 * Helper: Get past date (for testing validation)
 */
export function getPastDate(daysAgo = 7): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

/**
 * Helper: Get future time
 */
export function getFutureTime(): string {
  return "18:00";
}

/**
 * Helper: Clear all tables (useful for specific test setups)
 */
export function clearAllTables(): void {
  const statements = [
    "DELETE FROM Requests",
    "DELETE FROM Events",
    "DELETE FROM Sessions",
    "DELETE FROM Places",
    "DELETE FROM Users",
  ];

  for (const sqlStatement of statements) {
    try {
      sqlite.exec(sqlStatement);
    } catch (e) {
      // Ignore errors for tables that don't exist
    }
  }
}
