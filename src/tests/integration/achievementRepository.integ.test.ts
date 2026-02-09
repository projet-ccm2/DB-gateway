import { PrismaDatabase } from "../../database/prismaDatabase";
import { AchievementRepository } from "../../repositories/achievementRepository";

describe("AchievementRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new AchievementRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("add with channelId then getById returns the achievement", async () => {
    const channel = await db.addChannel({ name: "AchChannel_" + Date.now() });
    const input = {
      title: "IntegAch",
      description: "Integration achievement",
      goal: 5,
      reward: 50,
      label: "labelAch",
      channelId: channel.id,
    };
    const created = await repo.add(input);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(input.title);
    expect(created.description).toBe(input.description);
    expect(created.goal).toBe(input.goal);
    expect(created.reward).toBe(input.reward);
    expect(created.label).toBe(input.label);

    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.title).toBe(input.title);
  });

  it("add without channelId then getById returns the achievement", async () => {
    const input = {
      title: "AchNoChannel_" + Date.now(),
      description: "No channel",
      goal: 1,
      reward: 10,
      label: "noCh",
    };
    const created = await repo.add(input);
    expect(created.id).toBeDefined();
    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe(input.title);
  });

  it("getById with unknown id returns null", async () => {
    const found = await repo.getById("unknown-achievement-id");
    expect(found).toBeNull();
  });
});
