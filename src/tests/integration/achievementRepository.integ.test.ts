import { PrismaDatabase } from "../../database/prismaDatabase";
import { AchievementRepository } from "../../repositories/achievementRepository";

describe("AchievementRepository (integration)", () => {
  const db = new PrismaDatabase();
  const repo = new AchievementRepository(db);
  let type: { id: string; label: string; data: string };
  let type2: { id: string; label: string; data: string };

  beforeAll(async () => {
    type = await db.addTypeAchievement({ label: "TL", data: "TD" });
    type2 = await db.addTypeAchievement({ label: "NTL", data: "NTD" });
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("add with channelId then getById returns the achievement", async () => {
    const channel = await db.addChannel({
      id: "ch-ach-integ-" + Date.now(),
      name: "AchChannel_" + Date.now(),
    });
    const input = {
      title: "IntegAch",
      description: "Integration achievement",
      goal: 5,
      reward: 50,
      label: "labelAch",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    };
    const created = (await repo.add(input))!;
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
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      typeId: type.id,
    };
    const created = (await repo.add(input))!;
    expect(created.id).toBeDefined();
    const found = await repo.getById(created.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe(input.title);
  });

  it("getById with unknown id returns null", async () => {
    const found = await repo.getById("unknown-achievement-id");
    expect(found).toBeNull();
  });

  it("activate sets active to true", async () => {
    const channel = await db.addChannel({
      id: "ch-activate-" + Date.now(),
      name: "ActivateCh_" + Date.now(),
    });
    const created = (await repo.add({
      title: "ToActivate_" + Date.now(),
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: false,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    }))!;
    expect(created.active).toBe(false);
    const activated = await repo.activate(created.id);
    expect(activated).not.toBeNull();
    expect(activated?.active).toBe(true);
    expect(activated?.channelId).toBe(channel.id);
    expect(activated?.typeAchievement).not.toBeNull();
  });

  it("activate returns null when achievement not found", async () => {
    const result = await repo.activate("unknown-id");
    expect(result).toBeNull();
  });

  it("deactivate sets active to false", async () => {
    const channel = await db.addChannel({
      id: "ch-deactivate-" + Date.now(),
      name: "DeactivateCh_" + Date.now(),
    });
    const created = (await repo.add({
      title: "ToDeactivate_" + Date.now(),
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    }))!;
    expect(created.active).toBe(true);
    const deactivated = await repo.deactivate(created.id);
    expect(deactivated).not.toBeNull();
    expect(deactivated?.active).toBe(false);
    expect(deactivated?.channelId).toBe(channel.id);
  });

  it("deactivate returns null when achievement not found", async () => {
    const result = await repo.deactivate("unknown-id");
    expect(result).toBeNull();
  });

  it("makePublic sets public to true", async () => {
    const channel = await db.addChannel({
      id: "ch-public-" + Date.now(),
      name: "PublicCh_" + Date.now(),
    });
    const created = (await repo.add({
      title: "ToPublic_" + Date.now(),
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    }))!;
    expect(created.public).toBe(false);
    const result = await repo.makePublic(created.id);
    expect(result).not.toBeNull();
    expect(result?.public).toBe(true);
    expect(result?.channelId).toBe(channel.id);
    expect(result?.typeAchievement).not.toBeNull();
  });

  it("makePublic returns null when achievement not found", async () => {
    const result = await repo.makePublic("unknown-id");
    expect(result).toBeNull();
  });

  it("makePrivate sets public to false", async () => {
    const channel = await db.addChannel({
      id: "ch-private-" + Date.now(),
      name: "PrivateCh_" + Date.now(),
    });
    const created = (await repo.add({
      title: "ToPrivate_" + Date.now(),
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    }))!;
    expect(created.public).toBe(true);
    const result = await repo.makePrivate(created.id);
    expect(result).not.toBeNull();
    expect(result?.public).toBe(false);
    expect(result?.channelId).toBe(channel.id);
  });

  it("makePrivate returns null when achievement not found", async () => {
    const result = await repo.makePrivate("unknown-id");
    expect(result).toBeNull();
  });

  it("getPublic returns only public achievements", async () => {
    const channel = await db.addChannel({
      id: "ch-getpub-" + Date.now(),
      name: "GetPubCh_" + Date.now(),
    });
    await repo.add({
      title: "PubInteg_" + Date.now(),
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: true,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    });
    const list = await repo.getPublic();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list.every((a) => a.public === true)).toBe(true);
    list.forEach((a) => {
      expect(a).toHaveProperty("typeAchievement");
      expect(a.typeAchievement).not.toBeNull();
    });
  });

  it("getDefinitionsByUserId returns achievements with achieved data", async () => {
    const channel = await db.addChannel({
      id: "ch-defuser-" + Date.now(),
      name: "DefUserCh_" + Date.now(),
    });
    const userId = "user-def-integ-" + Date.now();
    await db.addUser({
      id: userId,
      username: "DefUser",
      lastUpdateTimestamp: new Date().toISOString(),
    });
    const created = (await repo.add({
      title: "DefInteg_" + Date.now(),
      description: "D",
      goal: 5,
      reward: 10,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type.id,
    }))!;
    await db.addAchieved({
      achievementId: created.id,
      userId,
      count: 3,
      finished: false,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    const list = await repo.getDefinitionsByUserId(userId);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(1);
    const found = list.find((a) => a.id === created.id);
    expect(found).toBeDefined();
    expect(found?.title).toBe(created.title);
    expect(found).toHaveProperty("typeAchievement");
    expect(found?.typeAchievement).not.toBeNull();
    expect(found).toHaveProperty("achieved");
    expect(found?.achieved).not.toBeNull();
    expect(found?.achieved?.userId).toBe(userId);
    expect(found?.achieved?.count).toBe(3);
  });

  it("getDefinitionsByUserId returns empty array when no achieved records", async () => {
    const list = await repo.getDefinitionsByUserId("unknown-user-id");
    expect(list).toHaveLength(0);
  });

  it("update updates all fields and returns achievement", async () => {
    const created = (await repo.add({
      title: "IntUpd",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "i.png",
      typeId: type.id,
    }))!;
    const updated = await repo.update(created.id, {
      title: "IntUpdNew",
      description: "ND",
      goal: 99,
      reward: 50,
      label: "NL",
      public: true,
      active: false,
      secret: true,
      image: "n.png",
      typeId: type2.id,
    });
    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("IntUpdNew");
    expect(updated?.description).toBe("ND");
    expect(updated?.goal).toBe(99);
    expect(updated?.reward).toBe(50);
    expect(updated?.label).toBe("NL");
    expect(updated?.public).toBe(true);
    expect(updated?.active).toBe(false);
    expect(updated?.secret).toBe(true);
    expect(updated?.image).toBe("n.png");
    expect(updated?.typeAchievement.label).toBe("NTL");
    expect(updated?.typeAchievement.data).toBe("NTD");
  });

  it("update returns null when achievement not found", async () => {
    const result = await repo.update("unknown-id", { title: "X" });
    expect(result).toBeNull();
  });

  it("delete removes achievement and returns it", async () => {
    const created = (await repo.add({
      title: "IntDel",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      public: false,
      active: true,
      secret: false,
      image: "i.png",
      typeId: type.id,
    }))!;
    const deleted = await repo.delete(created.id);
    expect(deleted).not.toBeNull();
    expect(deleted?.id).toBe(created.id);
    expect(deleted?.title).toBe("IntDel");
    expect(deleted?.channelId).toBeDefined();
    // Verify it's actually gone
    const refetch = await repo.getById(created.id);
    expect(refetch).toBeNull();
  });

  it("delete returns null when achievement not found", async () => {
    const result = await repo.delete("unknown-id");
    expect(result).toBeNull();
  });
});
