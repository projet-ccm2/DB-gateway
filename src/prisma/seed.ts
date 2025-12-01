import "dotenv/config";
import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is not set in env");

  // parse DATABASE_URL like mysql://user:pass@host:port/db
  const url = new URL(dbUrl);
  const host = url.hostname;
  const port = Number(url.port) || 3306;
  const user = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  const database = url.pathname.replace(/^\//, "");

  const conn = await mysql.createConnection({ host, port, user, password, database });
  try {
    const id = randomUUID();
    const username = "SeedUser";
    await conn.execute(`INSERT INTO Users (User_ID, User_Username) VALUES (?, ?)`, [id, username]);
    console.log("Seed user inserted", id);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
