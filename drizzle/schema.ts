// // This is your drizzle schema file.

// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   name: text("name").default("not_provided"),
//   email: text("email").notNull(),
// });

// export const schema = {
//   users,
// };

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  UserID: integer("UserID", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  Username: text("Username").notNull().unique(),
  Name: text("Name").notNull().default(""),
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

export const events = sqliteTable("Events", {
  EventID: integer("EventID").primaryKey({ autoIncrement: true }),
  Name: text("Name").notNull(),
  Description: text("Description").notNull(),
  Location: text("Location").notNull(),
  Coordinates: text("Coordinates", { mode: "json" })
    .$type<[number, number]>()
    .notNull(),
  StartTime: text("StartTime").notNull(),
  EndTime: text("EndTime").notNull(),
  Tags: text("Tags", { mode: "json" }).$type<string[]>().notNull(),
  Date: integer("date", { mode: "timestamp" }).notNull(),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  UserID: integer("UserID").notNull(),
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

export const schema = {
  users,
};
