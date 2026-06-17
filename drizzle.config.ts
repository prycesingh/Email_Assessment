import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const host = process.env.DB_HOST ?? "localhost";
const port = Number(process.env.DB_PORT ?? 3306);
const user = process.env.DB_USER ?? "root";
const password = process.env.DB_PASSWORD ?? "";
const database = process.env.DB_NAME ?? "email_assessment";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    host,
    port,
    user,
    password,
    database
  },
  verbose: true,
  strict: false
});
