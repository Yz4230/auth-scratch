import { relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name"),
	password: text("password"),
});

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id"),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
