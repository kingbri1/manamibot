import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const commands = sqliteTable("commands", {
    name: text().primaryKey(),
    action: text().notNull(),
});
