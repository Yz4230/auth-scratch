import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

import config from "../drizzle.config";
import * as schema from "./schema";

const sqlite = new Database(config.dbCredentials.url);
export const db = drizzle(sqlite, { schema });
