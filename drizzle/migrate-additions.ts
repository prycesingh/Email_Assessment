import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    // Check if copy_penalty already exists
    const [cols1] = await conn.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'submissions' AND COLUMN_NAME = 'copy_penalty'`,
      [process.env.DB_NAME ?? "email_assessment"]
    );
    if ((cols1 as unknown[]).length === 0) {
      await conn.execute(
        `ALTER TABLE submissions ADD COLUMN copy_penalty INT NOT NULL DEFAULT 0`
      );
      console.log("✓ copy_penalty column added to submissions");
    } else {
      console.log("• copy_penalty already exists in submissions, skipping");
    }

    // Check if ai_detected already exists
    const [cols2] = await conn.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'evaluations' AND COLUMN_NAME = 'ai_detected'`,
      [process.env.DB_NAME ?? "email_assessment"]
    );
    if ((cols2 as unknown[]).length === 0) {
      await conn.execute(
        `ALTER TABLE evaluations ADD COLUMN ai_detected BOOLEAN NOT NULL DEFAULT FALSE`
      );
      console.log("✓ ai_detected column added to evaluations");
    } else {
      console.log("• ai_detected already exists in evaluations, skipping");
    }

    // Create session_manual_scores table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS session_manual_scores (
        session_id VARCHAR(36) NOT NULL PRIMARY KEY,
        score INT NOT NULL,
        notes TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ session_manual_scores table ensured");

    console.log("\nAll schema changes applied successfully!");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Migration error:", message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

main();
