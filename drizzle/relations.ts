import { relations } from "drizzle-orm/relations";
import { Users, Sessions, Requests, Events } from "./schema";

export const SessionsRelations = relations(Sessions, ({ one }) => ({
  User: one(Users, {
    fields: [Sessions.UserID],
    references: [Users.UserID],
  }),
}));

export const UsersRelations = relations(Users, ({ many }) => ({
  Sessions: many(Sessions),
  Requests: many(Requests),
}));

export const RequestsRelations = relations(Requests, ({ one }) => ({
  User: one(Users, {
    fields: [Requests.UserID],
    references: [Users.UserID],
  }),
  Event: one(Events, {
    fields: [Requests.EventID],
    references: [Events.EventID],
  }),
}));

export const EventRelations = relations(Events, ({ many }) => ({
  Requests: many(Requests),
}));
