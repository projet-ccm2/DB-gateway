import { PrismaDatabase } from "../../database/prismaDatabase";
import { UserRepository } from "../../repositories/userRepository";

describe("UserRepository (integration: Prisma + MySQL)", () => {
  const db = new PrismaDatabase();
  const service = new UserRepository(db);

  afterAll(async () => {
    await (db as any).prisma?.$disconnect();
  });

  it("should add and read a user from real MySQL via Prisma", async () => {
    const u = await service.addUser({
      username: "IntegrationUser",
      twitchUserId: "twitch_integ_001",
    });
    const fetched = await service.getUserById(u.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.username).toBe("IntegrationUser");
    expect(fetched?.twitchUserId).toBe("twitch_integ_001");
    expect(fetched?.profileImageUrl).toBeNull();
    expect(fetched?.channelDescription).toBeNull();
    expect(fetched?.scope).toBeNull();
  });

  it("should add user with all optional fields", async () => {
    const u = await service.addUser({
      username: "FullUser",
      twitchUserId: "twitch_integ_002",
      profileImageUrl: "https://example.com/img.png",
      channelDescription: "A test channel",
      scope: "chat:read user:read",
    });
    const fetched = await service.getUserById(u.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.profileImageUrl).toBe("https://example.com/img.png");
    expect(fetched?.channelDescription).toBe("A test channel");
    expect(fetched?.scope).toBe("chat:read user:read");
  });

  it("should return channels with userType for a user via getChannelsByUserId", async () => {
    const user = await service.addUser({
      username: "ChannelIntegUser",
      twitchUserId: "twitch_integ_003",
    });
    const channel = await db.addChannel({ name: "IntegChannel" });
    await db.addAre({
      userId: user.id,
      channelId: channel.id,
      userType: "subscriber",
    });

    const channels = await service.getChannelsByUserId(user.id);
    expect(channels.length).toBeGreaterThanOrEqual(1);

    const integChannel = channels.find((c) => c.name === "IntegChannel");
    expect(integChannel).toBeDefined();
    expect(integChannel?.userType).toBe("subscriber");
  });

  it("should return correct userType for multiple channels via getChannelsByUserId", async () => {
    const user = await service.addUser({
      username: "MultiChannelIntegUser",
      twitchUserId: "twitch_integ_003b",
    });
    const modChannel = await db.addChannel({ name: "ModeratorChannel" });
    const adminChannel = await db.addChannel({ name: "AdminChannel" });

    await db.addAre({
      userId: user.id,
      channelId: modChannel.id,
      userType: "moderator",
    });
    await db.addAre({
      userId: user.id,
      channelId: adminChannel.id,
      userType: "admin",
    });

    const channels = await service.getChannelsByUserId(user.id);
    expect(channels.length).toBeGreaterThanOrEqual(2);

    const mod = channels.find((c) => c.name === "ModeratorChannel");
    const admin = channels.find((c) => c.name === "AdminChannel");

    expect(mod?.userType).toBe("moderator");
    expect(admin?.userType).toBe("admin");
  });

  it("should return badges for a user via getBadgesByUserId", async () => {
    const user = await service.addUser({
      username: "BadgeIntegUser",
      twitchUserId: "twitch_integ_004",
    });
    const badge = await db.addBadge({
      title: "IntegBadge",
      img: "badge.png",
    });
    await db.addPossesses({
      userId: user.id,
      badgeId: badge.id,
      acquiredDate: new Date().toISOString(),
    });

    const badges = await service.getBadgesByUserId(user.id);
    expect(badges.length).toBeGreaterThanOrEqual(1);
    expect(badges.some((b) => b.title === "IntegBadge")).toBe(true);
  });

  it("should return achievements for a user via getAchievementsByUserId", async () => {
    const user = await service.addUser({
      username: "AchievementIntegUser",
      twitchUserId: "twitch_integ_005",
    });
    const achievement = await db.addAchievement({
      title: "IntegAchievement",
      description: "Integration test achievement",
      goal: 10,
      reward: 100,
      label: "test",
    });
    await db.addAchieved({
      achievementId: achievement.id,
      userId: user.id,
      count: 5,
      finished: false,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });

    const achievements = await service.getAchievementsByUserId(user.id);
    expect(achievements.length).toBeGreaterThanOrEqual(1);
    expect(achievements.some((a) => a.achievementId === achievement.id)).toBe(
      true,
    );
  });

  it("should return users for a channel via getUsersByChannelId", async () => {
    const user = await service.addUser({
      username: "ChannelMember",
      twitchUserId: "twitch_integ_006",
    });
    const channel = await db.addChannel({ name: "MemberChannel" });
    await db.addAre({
      userId: user.id,
      channelId: channel.id,
      userType: "viewer",
    });

    const users = await service.getUsersByChannelId(channel.id);
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users.some((u) => u.username === "ChannelMember")).toBe(true);
  });

  it("should return users for a badge via getUsersByBadgeId", async () => {
    const user = await service.addUser({
      username: "BadgeHolder",
      twitchUserId: "twitch_integ_007",
    });
    const badge = await db.addBadge({
      title: "HolderBadge",
      img: "holder.png",
    });
    await db.addPossesses({
      userId: user.id,
      badgeId: badge.id,
      acquiredDate: new Date().toISOString(),
    });

    const users = await service.getUsersByBadgeId(badge.id);
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users.some((u) => u.username === "BadgeHolder")).toBe(true);
  });

  it("should return users for an achievement via getUsersByAchievementId", async () => {
    const user = await service.addUser({
      username: "AchievementHolder",
      twitchUserId: "twitch_integ_008",
    });
    const achievement = await db.addAchievement({
      title: "HolderAchievement",
      description: "Test holder",
      goal: 1,
      reward: 50,
      label: "holder",
    });
    await db.addAchieved({
      achievementId: achievement.id,
      userId: user.id,
      count: 1,
      finished: true,
      labelActive: false,
      acquiredDate: new Date().toISOString(),
    });

    const users = await service.getUsersByAchievementId(achievement.id);
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users.some((u) => u.username === "AchievementHolder")).toBe(true);
  });
});
