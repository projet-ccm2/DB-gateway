import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import type { Config } from "../../../config/environment";
import { vpcAuthMiddleware } from "../../../middlewares/vpcAuthMiddleware";
import { createHealthRoutes } from "../../../routes/healthRoutes";
import { MockDatabase } from "../../mocks";

const TEST_SECRET = "test-secret";

function createAppWithMiddleware(
  config: Pick<Config, "nodeEnv" | "jwtSecret">,
): express.Express {
  const app = express();
  app.use(express.json());
  app.use(vpcAuthMiddleware(config as Config));
  app.use("/health", createHealthRoutes(new MockDatabase()));
  app.get("/protected", (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

function createValidToken(secret: string): string {
  return jwt.sign(
    { aud: "vpc-db-gateway", iat: Math.floor(Date.now() / 1000) },
    secret,
    { expiresIn: 3600 },
  );
}

describe("vpcAuthMiddleware (unit)", () => {
  describe("development/test bypass", () => {
    it("allows request without token when NODE_ENV=test", async () => {
      const app = createAppWithMiddleware({
        nodeEnv: "test",
        jwtSecret: TEST_SECRET,
      });
      const res = await request(app).get("/protected");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it("allows request without token when NODE_ENV=development", async () => {
      const app = createAppWithMiddleware({
        nodeEnv: "development",
        jwtSecret: TEST_SECRET,
      });
      const res = await request(app).get("/protected");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });
  });

  describe("production", () => {
    const prodConfig = {
      nodeEnv: "production",
      jwtSecret: TEST_SECRET,
    };

    it("returns 401 when no token provided", async () => {
      const app = createAppWithMiddleware(prodConfig);
      const res = await request(app).get("/protected");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Missing or invalid VPC token" });
    });

    it("returns 200 when valid token in X-VPC-Token", async () => {
      const app = createAppWithMiddleware(prodConfig);
      const token = createValidToken(TEST_SECRET);
      const res = await request(app)
        .get("/protected")
        .set("X-VPC-Token", token);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it("returns 200 when valid token in Authorization (dev fallback)", async () => {
      const app = createAppWithMiddleware(prodConfig);
      const token = createValidToken(TEST_SECRET);
      const res = await request(app)
        .get("/protected")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it("returns 401 when token is invalid", async () => {
      const app = createAppWithMiddleware(prodConfig);
      const res = await request(app)
        .get("/protected")
        .set("X-VPC-Token", "invalid-token");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Missing or invalid VPC token" });
    });

    it("returns 401 when token is expired", async () => {
      const app = createAppWithMiddleware(prodConfig);
      const expiredToken = jwt.sign(
        { aud: "vpc-db-gateway", iat: Math.floor(Date.now() / 1000) - 7200 },
        TEST_SECRET,
        { expiresIn: "-1h" },
      );
      const res = await request(app)
        .get("/protected")
        .set("X-VPC-Token", expiredToken);
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Missing or invalid VPC token" });
    });

    it("allows /health without token", async () => {
      const app = createAppWithMiddleware(prodConfig);
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: "ok", db: "up" });
    });
  });
});
