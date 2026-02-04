import { PrismaDatabase } from "../../database/prismaDatabase";
import { UserRepository } from "../../repositories/userRepository";

describe("UserRepository (integration: Prisma + MySQL)", () => {
  const db = new PrismaDatabase();
  const service = new UserRepository(db);

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return all achievements for a channel via getAchievementsByChannelId", async () => {
    const channel = await db.addChannel({ name: "TestChannelForAchievements" });
    const achievement1 = await db.addAchievement({
      title: "ChannelAch1",
      description: "First channel achievement",
      goal: 1,
      reward: 10,
      label: "label1",
      channelId: channel.id,
    });
    const achievement2 = await db.addAchievement({
      title: "ChannelAch2",
      description: "Second channel achievement",
      goal: 2,
      reward: 20,
      label: "label2",
      channelId: channel.id,
    });
    const otherChannel = await db.addChannel({
      name: "OtherChannelForAchievements",
    });
    await db.addAchievement({
      title: "OtherChannelAch",
      description: "Other channel achievement",
      goal: 3,
      reward: 30,
      label: "label3",
      channelId: otherChannel.id,
    });
    const achievements = await service.getAchievementsByChannelId(channel.id);
    expect(achievements.length).toBeGreaterThanOrEqual(2);
    const titles = achievements.map((a) => a.title);
    expect(titles).toContain("ChannelAch1");
    expect(titles).toContain("ChannelAch2");
    expect(titles).not.toContain("OtherChannelAch");
  });

  it("should return all achieved records for a user and channelIds via getAchievedByUserAndChannels", async () => {
    const user = await service.addUser({
      username: "AchievedUser",
      twitchUserId: "twitch_achieved_user",
    });
    const channel1 = await db.addChannel({ name: "AchievedChannel1" });
    const channel2 = await db.addChannel({ name: "AchievedChannel2" });
    const achievement1 = await db.addAchievement({
      title: "Achieved1",
      description: "desc1",
      goal: 1,
      reward: 10,
      label: "l1",
      channelId: channel1.id,
    });
    const achievement2 = await db.addAchievement({
      title: "Achieved2",
      description: "desc2",
      goal: 2,
      reward: 20,
      label: "l2",
      channelId: channel2.id,
    });
    await db.addAchieved({
      achievementId: achievement1.id,
      userId: user.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    await db.addAchieved({
      achievementId: achievement2.id,
      userId: user.id,
      count: 2,
      finished: true,
      labelActive: false,
      acquiredDate: new Date().toISOString(),
    });
    const otherUser = await service.addUser({
      username: "OtherUser",
      twitchUserId: "twitch_other_user",
    });
    await db.addAchieved({
      achievementId: achievement1.id,
      userId: otherUser.id,
      count: 1,
      finished: false,
      labelActive: false,
      acquiredDate: new Date().toISOString(),
    });
    const achieved = await service.getAchievedByUserAndChannels(user.id, [
      channel1.id,
      channel2.id,
    ]);
    expect(achieved.length).toBe(2);
    const achIds = achieved.map((a) => a.achievementId);
    expect(achIds).toContain(achievement1.id);
    expect(achIds).toContain(achievement2.id);
    const achievedOne = await service.getAchievedByUserAndChannels(user.id, [
      channel1.id,
    ]);
    expect(achievedOne.length).toBe(1);
    expect(achievedOne[0].achievementId).toBe(achievement1.id);
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
    const channel = await db.addChannel({ name: "AchievementUserChannel" });
    const achievement = await db.addAchievement({
      title: "IntegAchievement",
      description: "Integration test achievement",
      goal: 10,
      reward: 100,
      label: "test",
      channelId: channel.id,
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

  it("should return users with userType for a channel via getUsersByChannelId", async () => {
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

    const channelMember = users.find((u) => u.username === "ChannelMember");
    expect(channelMember?.userType).toBe("viewer");
  });

  it("should return correct userType for multiple users in channel via getUsersByChannelId", async () => {
    const admin = await service.addUser({
      username: "ChannelAdmin",
      twitchUserId: "twitch_integ_admin",
    });
    const mod = await service.addUser({
      username: "ChannelMod",
      twitchUserId: "twitch_integ_mod",
    });
    const channel = await db.addChannel({ name: "MultiUserChannel" });

    await db.addAre({
      userId: admin.id,
      channelId: channel.id,
      userType: "admin",
    });
    await db.addAre({
      userId: mod.id,
      channelId: channel.id,
      userType: "moderator",
    });

    const users = await service.getUsersByChannelId(channel.id);
    expect(users.length).toBeGreaterThanOrEqual(2);

    const adminResult = users.find((u) => u.username === "ChannelAdmin");
    const modResult = users.find((u) => u.username === "ChannelMod");

    expect(adminResult?.userType).toBe("admin");
    expect(modResult?.userType).toBe("moderator");
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
    const channel = await db.addChannel({ name: "HolderAchievementChannel" });
    const achievement = await db.addAchievement({
      title: "HolderAchievement",
      description: "Test holder",
      goal: 1,
      reward: 50,
      label: "holder",
      channelId: channel.id,
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
