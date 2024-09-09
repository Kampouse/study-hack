import {
  sqliteTable,
  AnySQLiteColumn,
  uniqueIndex,
  integer,
  text,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const Users = sqliteTable(
  "Users",
  {
    UserID: integer("UserID").primaryKey({ autoIncrement: true }).notNull(),
    Username: text("Username").notNull(),
    Name: text("Name").default("").notNull(),
    Email: text("Email").notNull(),
    ImageURL: text("ImageURL"),
    Description: text("Description"),
    IsAdmin: integer("IsAdmin").default(0).notNull(),
    Intrestets: text("Intrestets").default("[]").notNull(),
    CreatedAt: text("CreatedAt").default("sql`(CURRENT_TIMESTAMP)`"),
  },
  (table) => {
    return {
      Email_unique: uniqueIndex("Users_Email_unique").on(table.Email),
      Username_unique: uniqueIndex("Users_Username_unique").on(table.Username),
    };
  },
);

export const Sessions = sqliteTable(
  "Sessions",
  {
    SessionID: integer("SessionID")
      .primaryKey({ autoIncrement: true })
      .notNull(),
    UserID: integer("UserID")
      .notNull()
      .references(() => Users.UserID),
    SessionToken: text("SessionToken").notNull(),
    CreatedAt: text("CreatedAt").default("sql`(CURRENT_TIMESTAMP)`"),
    ExpiresAt: text("ExpiresAt"),
  },
  (table) => {
    return {
      SessionToken_unique: uniqueIndex("Sessions_SessionToken_unique").on(
        table.SessionToken,
      ),
    };
  },
);

export const Events = sqliteTable("Events", {
  EventID: integer("EventID").primaryKey({ autoIncrement: true }).notNull(),
  Name: text("Name").notNull(),
  Description: text("Description").notNull(),
  Location: text("Location").notNull(),
  Coordinates: text("Coordinates").notNull(),
  StartTime: text("StartTime").notNull(),
  EndTime: text("EndTime").notNull(),
  Tags: text("Tags").notNull(),
  Date: integer("Date").notNull(),
  CreatedAt: text("CreatedAt").default("sql`(CURRENT_TIMESTAMP)`"),
  UserID: integer("UserID").notNull(),
  ImageUrl: text("ImageUrl"),
});

export const Requests = sqliteTable("Requests", {
  RequestID: integer("RequestID").primaryKey({ autoIncrement: true }).notNull(),
  EventID: integer("EventID")
    .notNull()
    .references(() => Events.EventID),
  UserID: integer("UserID")
    .notNull()
    .references(() => Users.UserID),
  Status: text("Status").default("pending").notNull(),
  Background: text("Background"),
  Experience: text("Experience"),
  WhyJoin: text("WhyJoin"),
  CreatedAt: text("CreatedAt").default("sql`(CURRENT_TIMESTAMP)`"),
});
