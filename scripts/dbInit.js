const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function loadEnv(file) {
  const p = path.resolve(file);
  if (!fs.existsSync(p)) return {};
  const content = fs.readFileSync(p, "utf8");
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2];
    // strip quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[m[1]] = val;
  }
  return env;
}

const envFile = path.resolve(process.cwd(), ".env.test");
const env = loadEnv(envFile);
const myEnv = Object.assign({}, process.env, env);

(async function main() {
  try {
    console.log("Running: npx prisma generate");
    execSync("npx prisma generate", { stdio: "inherit", env: myEnv });

    // Wait for MySQL to accept connections with provided credentials
    const mysql = require("mysql2/promise");
    const maxRetries = 20;
    let connected = false;

    // derive connection info from DATABASE_URL if present
    let dbHost = "127.0.0.1";
    let dbPort = 3307;
    let dbUser = env.MYSQL_USER || "testuser";
    let dbPass = env.MYSQL_PASSWORD || "testpass";
    let dbName = env.MYSQL_DATABASE || "test_db";

    if (env.DATABASE_URL) {
      try {
        const parsed = new URL(env.DATABASE_URL);
        dbHost = parsed.hostname || dbHost;
        dbPort = Number(parsed.port) || dbPort;
        dbUser = decodeURIComponent(parsed.username) || dbUser;
        dbPass = decodeURIComponent(parsed.password) || dbPass;
        dbName = parsed.pathname ? parsed.pathname.replace(/^\//, "") : dbName;
      } catch (e) {
        // ignore parse error and use defaults
      }
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        const conn = await mysql.createConnection({
          host: dbHost,
          port: dbPort,
          user: dbUser,
          password: dbPass,
          database: dbName,
        });
        await conn.end();
        connected = true;
        console.log("MySQL: credentials accepted");
        break;
      } catch (err) {
        console.log("Waiting for MySQL to be ready (attempt", i + 1, ")");
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    if (!connected) throw new Error("MySQL did not accept credentials in time");

    console.log("Running: npx prisma db push");
    execSync("npx prisma db push", { stdio: "inherit", env: myEnv });

    console.log("Running seed script: ts-node src/prisma/seed.ts");
    execSync("npx ts-node src/prisma/seed.ts", {
      stdio: "inherit",
      env: myEnv,
    });

    console.log("DB init completed.");
  } catch (err) {
    console.error("dbInit failed:", err && err.message ? err.message : err);
    process.exit(1);
  }
})();
