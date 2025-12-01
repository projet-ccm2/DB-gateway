// @ts-nocheck
import express from "express";
import { createMockGateway } from "./index";

const app = express();
// use a minimal json parser compatible with our lightweight types
app.use((req, _res, next) => {
  try {
    let data = "";
    req.on("data", (chunk: any) => (data += chunk));
    req.on("end", () => {
      try {
        (req as any).body = data ? JSON.parse(data) : {};
      } catch {
        (req as any).body = {};
      }
      next();
    });
  } catch {
    next();
  }
});

// For demo we use a mock gateway by default. In production you can swap to prisma gateway.
const { repo } = createMockGateway();

app.post("/users", async (req: any, res: any) => {
  try {
    const { username } = req.body as { username?: string };
    if (!username) return res.status(400).json({ error: "username required" });
    // repository.addUser expects a username string
    const user = await repo.addUser(username);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users/:id", async (req: any, res: any) => {
  try {
    const user = await repo.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;

if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
  );
}
