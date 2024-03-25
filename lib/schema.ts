import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  passwordHash: text("password").notNull(),
  salt: text("salt").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionKey: text("session").notNull(),
  data: text("data").notNull(),
  expires: integer("expires").notNull(),
});
