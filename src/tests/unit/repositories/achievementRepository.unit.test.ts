import { AchievementRepository } from "../../../repositories/achievementRepository";
import { MockDatabase } from "../../mocks";

describe("achievementRepository (unit)", () => {
  it("add then getById returns the achievement", async () => {
    const db = new MockDatabase();
    const ch = await db.addChannel({ id: "ch-ach-repo-1", name: "Ch" });
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "T",
      description: "D",
      goal: 1,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeLabel: "TL",
      typeData: "TD",
    });
    expect(created.id).toBeDefined();
    expect(created.title).toBe("T");
    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });

  it("getById returns null for unknown id", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const found = await repo.getById("unknown-id");
    expect(found).toBeNull();
  });

  it("getByChannelId returns achievements with typeAchievement", async () => {
    const db = new MockDatabase();
    const ch = await db.addChannel({ id: "ch-ach-repo-2", name: "Ch" });
    const repo = new AchievementRepository(db);
    await repo.add({
      title: "T1",
      description: "D1",
      goal: 1,
      reward: 10,
      label: "L1",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: ch.id,
      typeLabel: "TL",
      typeData: "TD",
    });
    const list = await repo.getByChannelId(ch.id);
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("T1");
    expect(list[0]).toHaveProperty("typeAchievement");
    expect(list[0].typeAchievement).not.toBeNull();
  });

  it("getPublic returns only public achievements", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    await repo.add({
      title: "Pub",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    await repo.add({
      title: "Priv",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const list = await repo.getPublic();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("Pub");
    expect(list[0].public).toBe(true);
    expect(list[0]).toHaveProperty("typeAchievement");
  });

  it("getPublic returns empty array when no public achievements", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    await repo.add({
      title: "Priv",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const list = await repo.getPublic();
    expect(list).toHaveLength(0);
  });

  it("getDefinitionsByUserId returns achievements with achieved data", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const ach = await repo.add({
      title: "DefRepo",
      description: "D",
      goal: 5,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    await db.addAchieved({
      achievementId: ach.id,
      userId: "user-def-repo",
      count: 3,
      finished: false,
      labelActive: true,
      acquiredDate: "2024-06-01T00:00:00.000Z",
    });
    const list = await repo.getDefinitionsByUserId("user-def-repo");
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("DefRepo");
    expect(list[0]).toHaveProperty("typeAchievement");
    expect(list[0].achieved).not.toBeNull();
    expect(list[0].achieved?.userId).toBe("user-def-repo");
  });

  it("getDefinitionsByUserId returns empty array when no achieved records", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const list = await repo.getDefinitionsByUserId("no-user");
    expect(list).toHaveLength(0);
  });

  it("activate sets active to true and returns achievement", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "Inactive",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: false,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const result = await repo.activate(created.id);
    expect(result).not.toBeNull();
    expect(result?.active).toBe(true);
  });

  it("activate returns null when achievement not found", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const result = await repo.activate("unknown");
    expect(result).toBeNull();
  });

  it("deactivate sets active to false and returns achievement", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "Active",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const result = await repo.deactivate(created.id);
    expect(result).not.toBeNull();
    expect(result?.active).toBe(false);
  });

  it("deactivate returns null when achievement not found", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const result = await repo.deactivate("unknown");
    expect(result).toBeNull();
  });

  it("makePublic sets public to true and returns achievement", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "Private",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const result = await repo.makePublic(created.id);
    expect(result).not.toBeNull();
    expect(result?.public).toBe(true);
  });

  it("makePublic returns null when achievement not found", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const result = await repo.makePublic("unknown");
    expect(result).toBeNull();
  });

  it("makePrivate sets public to false and returns achievement", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "Public",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const result = await repo.makePrivate(created.id);
    expect(result).not.toBeNull();
    expect(result?.public).toBe(false);
  });

  it("makePrivate returns null when achievement not found", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const result = await repo.makePrivate("unknown");
    expect(result).toBeNull();
  });

  it("update updates all fields and returns achievement", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "Old",
      description: "OldD",
      goal: 1,
      reward: 1,
      label: "OldL",
      public: false,
      active: true,
      secret: false,
      image: "old.png",
      typeLabel: "OldTL",
      typeData: "OldTD",
    });
    const result = await repo.update(created.id, {
      title: "New",
      description: "NewD",
      goal: 99,
      reward: 50,
      label: "NewL",
      public: true,
      active: false,
      secret: true,
      image: "new.png",
      typeLabel: "NewTL",
      typeData: "NewTD",
    });
    expect(result).not.toBeNull();
    expect(result?.title).toBe("New");
    expect(result?.description).toBe("NewD");
    expect(result?.goal).toBe(99);
    expect(result?.reward).toBe(50);
    expect(result?.label).toBe("NewL");
    expect(result?.public).toBe(true);
    expect(result?.active).toBe(false);
    expect(result?.secret).toBe(true);
    expect(result?.image).toBe("new.png");
    expect(result?.typeAchievement.label).toBe("NewTL");
    expect(result?.typeAchievement.data).toBe("NewTD");
  });

  it("update returns null when achievement not found", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const result = await repo.update("unknown", { title: "X" });
    expect(result).toBeNull();
  });

  it("delete removes achievement and returns it", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const created = await repo.add({
      title: "ToDelete",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeLabel: "TL",
      typeData: "TD",
    });
    const result = await repo.delete(created.id);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(created.id);
    expect(result?.title).toBe("ToDelete");
    // Verify it's actually removed
    const refetch = await repo.getById(created.id);
    expect(refetch).toBeNull();
  });

  it("delete returns null when achievement not found", async () => {
    const db = new MockDatabase();
    const repo = new AchievementRepository(db);
    const result = await repo.delete("unknown");
    expect(result).toBeNull();
  });
});
