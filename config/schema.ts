import { integer, pgTable, varchar, json, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().notNull().default(0),
});

export const SessionChatTable = pgTable("sessionChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  notes: text().notNull(),
  conversation: json(),
  report: json(),
  createdBy: varchar().references(() => usersTable.email).notNull(),
  createdOn: varchar().notNull(),
  selectedDoctor: json()
});
