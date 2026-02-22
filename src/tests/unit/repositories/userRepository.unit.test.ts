import { UserRepository } from "../../../repositories/userRepository";
import { MockDatabase } from "../../mocks";

describe("userRepository (unit, mock db)", () => {
  it("should create and read a user using mockDatabase", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const created = await service.addUser({
      id: "twitch123",
      username: "Bob",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    expect(created).toHaveProperty("id");
    expect(created.id).toBe("twitch123");
    expect(created.username).toBe("Bob");
    expect(created.profileImageUrl).toBeNull();
    expect(created.channelDescription).toBeNull();
    expect(created.scope).toBeNull();

    const fetched = await service.getUserById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe("twitch123");
    expect(fetched?.username).toBe("Bob");
  });

  it("should create user with all optional fields", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const created = await service.addUser({
      id: "twitch456",
      username: "Alice",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      profileImageUrl: "https://example.com/avatar.png",
      channelDescription: "My awesome channel",
      scope: "chat:read chat:write",
    });

    expect(created.id).toBe("twitch456");
    expect(created.username).toBe("Alice");
    expect(created.profileImageUrl).toBe("https://example.com/avatar.png");
    expect(created.channelDescription).toBe("My awesome channel");
    expect(created.scope).toBe("chat:read chat:write");
  });

  it("adding multiple users creates separate entries", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const a = await service.addUser({
      id: "twitch001",
      username: "Bobby",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const b = await service.addUser({
      id: "twitch002",
      username: "Robert",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    expect(a.id).not.toBe(b.id);
    expect(b.username).toBe("Robert");
  });

  it("should return empty array when user has no channels", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch789",
      username: "NoChannelUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    const channels = await service.getChannelsByUserId(user.id);
    expect(channels).toEqual([]);
  });

  it("should return channels with userType for a user", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch111",
      username: "ChannelUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel1 = await mockDb.addChannel({
      id: "ch-user-1",
      name: "Channel One",
    });
    const channel2 = await mockDb.addChannel({
      id: "ch-user-2",
      name: "Channel Two",
    });

    await mockDb.addAre({
      userId: user.id,
      channelId: channel1.id,
      userType: "viewer",
    });
    await mockDb.addAre({
      userId: user.id,
      channelId: channel2.id,
      userType: "moderator",
    });

    const channels = await service.getChannelsByUserId(user.id);
    expect(channels).toHaveLength(2);

    expect(channels.map((c) => c.name)).toContain("Channel One");
    expect(channels.map((c) => c.name)).toContain("Channel Two");

    const channelOne = channels.find((c) => c.name === "Channel One");
    const channelTwo = channels.find((c) => c.name === "Channel Two");
    expect(channelOne?.userType).toBe("viewer");
    expect(channelTwo?.userType).toBe("moderator");
  });

  it("should return correct userType for each channel", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch112",
      username: "MultiRoleUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const adminChannel = await mockDb.addChannel({
      id: "ch-admin",
      name: "Admin Channel",
    });
    const modChannel = await mockDb.addChannel({
      id: "ch-mod",
      name: "Mod Channel",
    });
    const userChannel = await mockDb.addChannel({
      id: "ch-user",
      name: "User Channel",
    });

    await mockDb.addAre({
      userId: user.id,
      channelId: adminChannel.id,
      userType: "admin",
    });
    await mockDb.addAre({
      userId: user.id,
      channelId: modChannel.id,
      userType: "moderator",
    });
    await mockDb.addAre({
      userId: user.id,
      channelId: userChannel.id,
      userType: "user",
    });

    const channels = await service.getChannelsByUserId(user.id);
    expect(channels).toHaveLength(3);

    const admin = channels.find((c) => c.name === "Admin Channel");
    const mod = channels.find((c) => c.name === "Mod Channel");
    const regular = channels.find((c) => c.name === "User Channel");

    expect(admin?.userType).toBe("admin");
    expect(mod?.userType).toBe("moderator");
    expect(regular?.userType).toBe("user");
  });

  it("should return empty array when user has no badges", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch222",
      username: "NoBadgeUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    const badges = await service.getBadgesByUserId(user.id);
    expect(badges).toEqual([]);
  });

  it("should return badges for a user", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch333",
      username: "BadgeUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const badge1 = await mockDb.addBadge({
      title: "Gold Badge",
      img: "gold.png",
    });
    const badge2 = await mockDb.addBadge({
      title: "Silver Badge",
      img: "silver.png",
    });

    await mockDb.addPossesses({
      userId: user.id,
      badgeId: badge1.id,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    await mockDb.addPossesses({
      userId: user.id,
      badgeId: badge2.id,
      acquiredDate: "2024-02-01T00:00:00.000Z",
    });

    const badges = await service.getBadgesByUserId(user.id);
    expect(badges).toHaveLength(2);
    expect(badges.map((b) => b.title)).toContain("Gold Badge");
    expect(badges.map((b) => b.title)).toContain("Silver Badge");
  });

  it("should return empty array when user has no achievements", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch444",
      username: "NoAchievementUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    const achievements = await service.getAchievementsByUserId(user.id);
    expect(achievements).toEqual([]);
  });

  it("should return achievements for a user", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      id: "twitch555",
      username: "AchievementUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const achievement1 = await mockDb.addAchievement({
      title: "First Steps",
      description: "Complete tutorial",
      goal: 1,
      reward: 10,
      label: "beginner",
    });

    await mockDb.addAchieved({
      achievementId: achievement1.id,
      userId: user.id,
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: "2024-01-15T00:00:00.000Z",
    });

    const achievements = await service.getAchievementsByUserId(user.id);
    expect(achievements).toHaveLength(1);
    expect(achievements[0].achievementId).toBe(achievement1.id);
    expect(achievements[0].finished).toBe(true);
  });

  it("should return empty array when channel has no users", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const channel = await mockDb.addChannel({
      id: "ch-empty",
      name: "Empty Channel",
    });

    const users = await service.getUsersByChannelId(channel.id);
    expect(users).toEqual([]);
  });

  it("should return users with userType for a channel", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user1 = await service.addUser({
      id: "twitch666",
      username: "User1",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const user2 = await service.addUser({
      id: "twitch777",
      username: "User2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await mockDb.addChannel({
      id: "ch-popular",
      name: "Popular Channel",
    });

    await mockDb.addAre({
      userId: user1.id,
      channelId: channel.id,
      userType: "subscriber",
    });
    await mockDb.addAre({
      userId: user2.id,
      channelId: channel.id,
      userType: "viewer",
    });

    const users = await service.getUsersByChannelId(channel.id);
    expect(users).toHaveLength(2);
    expect(users.map((u) => u.username)).toContain("User1");
    expect(users.map((u) => u.username)).toContain("User2");

    const user1Result = users.find((u) => u.username === "User1");
    const user2Result = users.find((u) => u.username === "User2");
    expect(user1Result?.userType).toBe("subscriber");
    expect(user2Result?.userType).toBe("viewer");
  });

  it("should return correct userType for each user in channel", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const admin = await service.addUser({
      id: "twitch_admin",
      username: "AdminUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const mod = await service.addUser({
      id: "twitch_mod",
      username: "ModUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const regular = await service.addUser({
      id: "twitch_regular",
      username: "RegularUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await mockDb.addChannel({
      id: "ch-test",
      name: "TestChannel",
    });

    await mockDb.addAre({
      userId: admin.id,
      channelId: channel.id,
      userType: "admin",
    });
    await mockDb.addAre({
      userId: mod.id,
      channelId: channel.id,
      userType: "moderator",
    });
    await mockDb.addAre({
      userId: regular.id,
      channelId: channel.id,
      userType: "user",
    });

    const users = await service.getUsersByChannelId(channel.id);
    expect(users).toHaveLength(3);

    const adminResult = users.find((u) => u.username === "AdminUser");
    const modResult = users.find((u) => u.username === "ModUser");
    const regularResult = users.find((u) => u.username === "RegularUser");

    expect(adminResult?.userType).toBe("admin");
    expect(modResult?.userType).toBe("moderator");
    expect(regularResult?.userType).toBe("user");
  });

  it("should return empty array when badge has no owners", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const badge = await mockDb.addBadge({
      title: "Rare Badge",
      img: "rare.png",
    });

    const users = await service.getUsersByBadgeId(badge.id);
    expect(users).toEqual([]);
  });

  it("should return users who own a badge", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user1 = await service.addUser({
      id: "twitch888",
      username: "BadgeOwner1",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const user2 = await service.addUser({
      id: "twitch999",
      username: "BadgeOwner2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const badge = await mockDb.addBadge({
      title: "Common Badge",
      img: "common.png",
    });

    await mockDb.addPossesses({
      userId: user1.id,
      badgeId: badge.id,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    await mockDb.addPossesses({
      userId: user2.id,
      badgeId: badge.id,
      acquiredDate: "2024-01-02T00:00:00.000Z",
    });

    const users = await service.getUsersByBadgeId(badge.id);
    expect(users).toHaveLength(2);
    expect(users.map((u) => u.username)).toContain("BadgeOwner1");
    expect(users.map((u) => u.username)).toContain("BadgeOwner2");
  });

  it("should return empty array when achievement has no completers", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const achievement = await mockDb.addAchievement({
      title: "Hard Achievement",
      description: "Very difficult",
      goal: 100,
      reward: 1000,
      label: "expert",
    });

    const users = await service.getUsersByAchievementId(achievement.id);
    expect(users).toEqual([]);
  });

  it("getAchievementsByChannelId returns achievements for channel with typeAchievement", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);
    const ch = await mockDb.addChannel({ id: "ch-a", name: "AChannel" });
    await mockDb.addAchievement({
      title: "A1",
      description: "D1",
      goal: 1,
      reward: 1,
      label: "L1",
      channelId: ch.id,
    });
    const list = await service.getAchievementsByChannelId(ch.id);
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("A1");
    expect(list[0]).toHaveProperty("typeAchievement");
    expect(list[0].typeAchievement).toBeNull();
  });

  it("getAchievementsByUserAndChannel returns full structure with achieved", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);
    const user = await service.addUser({
      id: "twitchU",
      username: "U",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch = await mockDb.addChannel({ id: "ch-user-ch", name: "Ch" });
    const ach = await mockDb.addAchievement({
      title: "A",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
      channelId: ch.id,
    });
    await mockDb.addAchieved({
      achievementId: ach.id,
      userId: user.id,
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    const data = await service.getAchievementsByUserAndChannel(user.id, ch.id);
    expect(data.userId).toBe(user.id);
    expect(data.channelId).toBe(ch.id);
    expect(data.achievements).toHaveLength(1);
    expect(data.achievements[0].id).toBe(ach.id);
    expect(data.achievements[0].typeAchievement).toBeNull();
    expect(data.achievements[0].achieved).not.toBeNull();
    expect(data.achievements[0].achieved?.count).toBe(1);
  });

  it("getAchievedByUserAndChannels returns achieved for user and channels", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);
    const user = await service.addUser({
      id: "twitchAu",
      username: "Au",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const ch1 = await mockDb.addChannel({ id: "ch-c1", name: "C1" });
    const ach = await mockDb.addAchievement({
      title: "Ach",
      description: "D",
      goal: 1,
      reward: 1,
      label: "L",
    });
    await mockDb.addAchieved({
      achievementId: ach.id,
      userId: user.id,
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: "2024-01-01T00:00:00.000Z",
    });
    const list = await service.getAchievedByUserAndChannels(user.id, [ch1.id]);
    expect(Array.isArray(list)).toBe(true);
  });

  it("should return users who have an achievement", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user1 = await service.addUser({
      id: "twitchA01",
      username: "Achiever1",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const user2 = await service.addUser({
      id: "twitchA02",
      username: "Achiever2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const achievement = await mockDb.addAchievement({
      title: "Easy Achievement",
      description: "Simple task",
      goal: 1,
      reward: 5,
      label: "starter",
    });

    await mockDb.addAchieved({
      achievementId: achievement.id,
      userId: user1.id,
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: "2024-03-01T00:00:00.000Z",
    });
    await mockDb.addAchieved({
      achievementId: achievement.id,
      userId: user2.id,
      count: 1,
      finished: false,
      labelActive: false,
      acquiredDate: "2024-03-02T00:00:00.000Z",
    });

    const users = await service.getUsersByAchievementId(achievement.id);
    expect(users).toHaveLength(2);
    expect(users.map((u) => u.username)).toContain("Achiever1");
    expect(users.map((u) => u.username)).toContain("Achiever2");
  });
});
