export interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  encryptionKey: string;
  cors: {
    allowedOrigins: string[];
  };
}

function getEnv(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : defaultValue;
}

function validateConfig(): Config {
  const nodeEnv = getEnv("NODE_ENV", "development");
  const encryptionKey = getEnv(
    "ENCRYPTION_KEY",
    "dev-encryption-key-change-in-production",
  );
  if (
    nodeEnv === "production" &&
    encryptionKey === "dev-encryption-key-change-in-production"
  ) {
    throw new Error(
      "ENCRYPTION_KEY must be set to a secure value in production",
    );
  }
  return {
    port: Number.parseInt(getEnv("PORT", "3000"), 10),
    nodeEnv,
    databaseUrl: getEnv("DATABASE_URL", ""),
    jwtSecret: getEnv("JWT_SECRET", "dev-secret-change-in-production"),
    encryptionKey,
    cors: {
      allowedOrigins: getEnv("ALLOWED_ORIGINS", "").length
        ? getEnv("ALLOWED_ORIGINS", "")
            .split(",")
            .map((s) => s.trim())
        : ["http://localhost:3000", "http://localhost:8080", "null"],
    },
  };
}

export const config = validateConfig();
