import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Academic, Sports, Arts, Social
  date: varchar("date", { length: 100 }).notNull(),
  time: varchar("time", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  attendees: integer("attendees").notNull().default(0),
  imageUrl: text("image_url"),
  content: text("content"), // Full content for detail page
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
