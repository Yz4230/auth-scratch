import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";
import config from "../drizzle.config";

const sqlite = new Database(config.dbCredentials.url);
export const db = drizzle(sqlite, { schema });
