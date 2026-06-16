import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "@/db/schema";

import { getDatabaseUrl } from "@/lib/db-config";

const connectionString = getDatabaseUrl();
const client = mysql.createPool(connectionString);

export const db = drizzle(client, { schema, mode: "default" });
