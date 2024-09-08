import { relations } from "drizzle-orm/relations";
import { Users, Sessions } from "./schema";

export const SessionsRelations = relations(Sessions, ({ one }) => ({
  User: one(Users, {
    fields: [Sessions.UserID],
    references: [Users.UserID],
  }),
}));

export const UsersRelations = relations(Users, ({ many }) => ({
  Sessions: many(Sessions),
}));
