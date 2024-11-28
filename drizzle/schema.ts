import {
  sqliteTable,
  uniqueIndex,
  integer,
  text,
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
    CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
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
    CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
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

export const Events = sqliteTable("Events", {
  EventID: integer("EventID").primaryKey({ autoIncrement: true }),
  Name: text("Name").notNull(),
  Description: text("Description").notNull(),
  Location: text("Location").notNull(),
  ImageURL: text("ImageUrl"),
  Coordinates: text("Coordinates", { mode: "json" })
    .$type<[number, number]>()
    .notNull(),
  Date: text("Date").notNull(),
  StartTime: text("StartTime").notNull(),
  PlaceId: integer("PlaceId"),
  EndTime: text("EndTime").notNull(),
  Tags: text("Tags", { mode: "json" }).$type<string[]>().notNull(),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  UserID: integer("UserID")
    .notNull()
    .references(() => Users.UserID),
});

export const Places = sqliteTable("Places", {
  PlaceID: integer("PlaceID").primaryKey({ autoIncrement: true }),
  Name: text("Name").notNull(),
  Address: text("Address").notNull(),
  Description: text("Description").notNull(),
  ImageURL: text("ImageUrl"),
  Tags: text("Tags", { mode: "json" }).$type<string[]>(),
  Rating: integer("Rating").notNull(),
  WifiSpeed: integer("WifiSpeed"),
  HasQuietEnvironment: integer("HasQuietEnvironment"),
  IsPublic: integer("IsPublic").default(1).notNull(),
  CreatedAt: text("CreatedAt").default(sql`CURRENT_TIMESTAMP`),
  UserID: integer("UserID")
    .notNull()
    .references(() => Users.UserID),
});

export type Place = typeof Places.$inferSelect;
export type User = typeof Users.$inferSelect;
export type NewUser = typeof Users.$inferInsert;

export type Session = typeof Sessions.$inferSelect;
export type NewSession = typeof Sessions.$inferInsert;

export type Event = typeof Events.$inferSelect;
export type NewEvent = typeof Events.$inferInsert;
export type JoinEvent = typeof Requests.$inferInsert;
