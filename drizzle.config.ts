import type { Config } from "drizzle-kit";

export default {
	driver: "libsql",
	schema: "./lib/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: "db.sqlite",
	},
} satisfies Config;
