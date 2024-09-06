import {
  sqliteTable,
  AnySQLiteColumn,
  integer,
  text,
  numeric,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const Users = sqliteTable("Users", {
  UserID: integer("UserID").primaryKey({ autoIncrement: true }),
  Username: text("Username").notNull(),
  Name: text("Name").notNull(),
  Email: text("Email").notNull(),
  ImageURL: text("ImageURL"),
  IsAdmin: numeric("IsAdmin").notNull(),
  CreatedAt: numeric("CreatedAt").default(sql`(CURRENT_TIMESTAMP)`),
});

export const Sessions = sqliteTable("Sessions", {
  SessionID: integer("SessionID").primaryKey({ autoIncrement: true }),
  UserID: integer("UserID")
    .notNull()
    .references(() => Users.UserID),
  SessionToken: text("SessionToken").notNull(),
  CreatedAt: numeric("CreatedAt").default(sql`(CURRENT_TIMESTAMP)`),
  ExpiresAt: numeric("ExpiresAt"),
});
