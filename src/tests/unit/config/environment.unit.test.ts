describe("config environment", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("defaults when no env vars set", () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.ALLOWED_ORIGINS;
    delete process.env.DATABASE_URL;
    const { config } = require("../../../config/environment");
    expect(config.port).toBe(3000);
    expect(config.nodeEnv).toBe("development");
    expect(config.databaseUrl).toBe("");
    expect(Array.isArray(config.cors.allowedOrigins)).toBe(true);
  });

  test("parses env values", () => {
    process.env.PORT = "4000";
    process.env.NODE_ENV = "production";
    process.env.ALLOWED_ORIGINS = "https://a,https://b";
    process.env.DATABASE_URL = "mysql://localhost:3306/mydb";
    const { config } = require("../../../config/environment");
    expect(config.port).toBe(4000);
    expect(config.nodeEnv).toBe("production");
    expect(config.databaseUrl).toBe("mysql://localhost:3306/mydb");
    expect(config.cors.allowedOrigins).toEqual(["https://a", "https://b"]);
  });
});
