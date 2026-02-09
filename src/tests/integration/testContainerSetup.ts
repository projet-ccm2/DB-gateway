import { MySqlContainer, StartedMySqlContainer } from "@testcontainers/mysql";
import { execSync } from "child_process";

let container: StartedMySqlContainer | null = null;

export async function startTestContainer(): Promise<void> {
  if (container) return;

  container = await new MySqlContainer("mysql:8.0")
    .withDatabase("test_db")
    .withUsername("testuser")
    .withUserPassword("testpass")
    .withRootPassword("testroot")
    .start();

  const host = container.getHost();
  const port = container.getPort();
  const username = container.getUsername();
  const password = container.getUserPassword();
  const database = container.getDatabase();
  const databaseUrl = `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;

  process.env.DATABASE_URL = databaseUrl;

  execSync("npx prisma generate", { stdio: "inherit" });
  execSync("npx prisma db push", { stdio: "inherit" });
}

export async function stopTestContainer(): Promise<void> {
  if (container) {
    await container.stop();
    container = null;
  }
}
