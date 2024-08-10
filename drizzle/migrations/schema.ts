import {
  sqliteTable,
  AnySQLiteColumn,
  uniqueIndex,
  integer,
  text,
  numeric,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const Users = sqliteTable(
  "Users",
  {
    UserID: integer("UserID").primaryKey({ autoIncrement: true }),
    Username: text("Username").notNull(),
    Name: text("Name").notNull(),
    Email: text("Email").notNull(),
    ImageURL: text("ImageURL"),
    IsAdmin: numeric("IsAdmin").notNull(),
    CreatedAt: numeric("CreatedAt").default(sql`(CURRENT_TIMESTAMP)`),
    Description: text("Description"),
    Intrestets: text("Intrestets").default("[]"),
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
    SessionID: integer("SessionID").primaryKey({ autoIncrement: true }),
    UserID: integer("UserID")
      .notNull()
      .references(() => Users.UserID),
    SessionToken: text("SessionToken").notNull(),
    CreatedAt: numeric("CreatedAt").default(sql`(CURRENT_TIMESTAMP)`),
    ExpiresAt: numeric("ExpiresAt"),
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
  date: integer("date").notNull(),
  CreatedAt: text("CreatedAt").default("sql`(CURRENT_TIMESTAMP)`"),
  UserID: integer("UserID").notNull(),
});
