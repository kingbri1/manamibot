import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./db/drizzle",
    schema: "./src/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: "manamibot.db",
    },
});
