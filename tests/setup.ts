import Database from 'better-sqlite3'
import { sql } from 'drizzle-orm'
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { afterEach, beforeEach } from 'vitest'
import * as schema from '../drizzle/schema'

/**
 * Global test database instance
 * Each test gets a fresh in-memory database
 */
export let testDb: BetterSQLite3Database<typeof schema>
export let sqlite: Database.Database

/**
 * Create a fresh in-memory SQLite database with schema
 */
export function createTestDatabase() {
  // Create in-memory SQLite database
  sqlite = new Database(':memory:')
  testDb = drizzle(sqlite, { schema })

  // Create all tables from schema
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT NOT NULL UNIQUE,
      Name TEXT NOT NULL DEFAULT '',
      Email TEXT NOT NULL UNIQUE,
      ImageURL TEXT,
      Description TEXT,
      IsAdmin INTEGER NOT NULL DEFAULT 0,
      Intrestets TEXT NOT NULL DEFAULT '[]',
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Sessions (
      SessionID INTEGER PRIMARY KEY AUTOINCREMENT,
      UserID INTEGER NOT NULL REFERENCES Users(UserID),
      SessionToken TEXT NOT NULL UNIQUE,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      ExpiresAt TEXT
    );

    CREATE TABLE IF NOT EXISTS Events (
      EventID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Description TEXT NOT NULL,
      Location TEXT NOT NULL,
      ImageURL TEXT,
      Coordinates TEXT NOT NULL,
      Date TEXT NOT NULL,
      StartTime TEXT NOT NULL,
      PlaceId INTEGER,
      EndTime TEXT NOT NULL,
      Tags TEXT NOT NULL,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UserID INTEGER NOT NULL REFERENCES Users(UserID)
    );

    CREATE TABLE IF NOT EXISTS Requests (
      RequestID INTEGER PRIMARY KEY AUTOINCREMENT,
      EventID INTEGER NOT NULL REFERENCES Events(EventID),
      UserID INTEGER NOT NULL REFERENCES Users(UserID),
      Status TEXT NOT NULL DEFAULT 'pending',
      Background TEXT,
      Experience TEXT,
      WhyJoin TEXT,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Places (
      PlaceID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Address TEXT NOT NULL,
      ImageURL TEXT,
      Description TEXT NOT NULL,
      Tags TEXT,
      Rating INTEGER NOT NULL DEFAULT 0,
      WifiSpeed INTEGER,
      HasQuietEnvironment INTEGER,
      Price TEXT,
      Coordinates TEXT,
      Category TEXT,
      IsPublic INTEGER NOT NULL DEFAULT 1,
      CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UserID INTEGER NOT NULL REFERENCES Users(UserID)
    );
  `)

  return testDb
}

/**
 * Clean up database after test
 */
export function cleanupTestDatabase() {
  if (sqlite) {
    sqlite.close()
  }
}

/**
 * Setup: Create fresh database before each test
 */
beforeEach(() => {
  createTestDatabase()
})

/**
 * Teardown: Clean up database after each test
 */
afterEach(() => {
  cleanupTestDatabase()
})

/**
 * Helper: Get current timestamp in SQLite format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Helper: Get future date (for events)
 */
export function getFutureDate(daysAhead = 7): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString().split('T')[0]
}

/**
 * Helper: Get past date (for testing validation)
 */
export function getPastDate(daysAgo = 7): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

/**
 * Helper: Get future time
 */
export function getFutureTime(): string {
  return '18:00'
}

/**
 * Helper: Clear all tables (useful for specific test setups)
 */
export function clearAllTables() {
  sqlite.exec(`
    DELETE FROM Requests;
    DELETE FROM Events;
    DELETE FROM Sessions;
    DELETE FROM Places;
    DELETE FROM Users;
  `)
}
