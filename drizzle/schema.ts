import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  UserID: integer("UserID", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  Username: text("Username").notNull().unique(),
  Name: text("Name").notNull(),
  Email: text("Email").notNull().unique(),
  ImageURL: text("ImageURL"),
  Description: text("Description"),
  IsAdmin: integer("IsAdmin", { mode: "boolean" }).notNull().default(false),
  Intrests: text("Intrestets", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
});

export const joinRequests = sqliteTable("JoinRequests", {
  RequestID: integer("RequestID").primaryKey({ autoIncrement: true }),
  EventID: integer("EventID")
    .notNull()
    .references(() => events.EventID),
  UserID: integer("UserID")
    .notNull()
    .references(() => users.UserID),
  Status: text("Status").notNull().default("pending"),
  Message: text("Message"),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
});

export type InsertJoinRequest = typeof joinRequests.$inferInsert;
export type SelectJoinRequest = typeof joinRequests.$inferSelect;

export const events = sqliteTable("Events", {
  EventID: integer("EventID").primaryKey({ autoIncrement: true }),
  Name: text("Name").notNull(),
  Description: text("Description").notNull(),
  Location: text("Location").notNull(),
  Coordinates: text("Coordinates", { mode: "json" })
    .$type<[number, number]>()
    .notNull(),
  Date: text("Date").notNull(),
  StartTime: text("StartTime").notNull(),
  EndTime: text("EndTime").notNull(),
  Tags: text("Tags", { mode: "json" }).$type<string[]>().notNull(),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  UserID: integer("UserID")
    .notNull()
    .references(() => users.UserID),
});
export const sessions = sqliteTable("Sessions", {
  SessionID: integer("SessionID", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  UserID: integer("UserID")
    .notNull()
    .references(() => users.UserID),
  SessionToken: text("SessionToken").notNull().unique(),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  ExpiresAt: text("ExpiresAt"),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const schema = {
  users,
};
