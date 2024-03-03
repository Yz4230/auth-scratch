import type { Config } from "drizzle-kit";

export default {
  driver: "better-sqlite",
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "db.sqlite",
  },
} satisfies Config;
