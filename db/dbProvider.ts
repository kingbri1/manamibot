import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/node-sqlite";

const sqlite = new DatabaseSync("manamibot.db");
export const db = drizzle({ client: sqlite });

export function initializeDatabase() {
    sqlite.prepare("PRAGMA journal_mode = WAL;").run();
}
