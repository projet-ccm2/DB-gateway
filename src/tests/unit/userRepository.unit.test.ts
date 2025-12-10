import { UserRepository } from "../../repositories/userRepository";
import { MockDatabase } from "../../database/mockDatabase";

describe("userRepository (unit, mock db)", () => {
  it("should create and read a user using mockDatabase", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const created = await service.addUser({
      username: "Bob",
      twitchUserId: "twitch123",
    });
    expect(created).toHaveProperty("id");
    expect(created.username).toBe("Bob");
    expect(created.twitchUserId).toBe("twitch123");
    expect(created.profileImageUrl).toBeNull();
    expect(created.channelDescription).toBeNull();
    expect(created.scope).toBeNull();

    const fetched = await service.getUserById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.username).toBe("Bob");
    expect(fetched?.twitchUserId).toBe("twitch123");
  });

  it("should create user with all optional fields", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const created = await service.addUser({
      username: "Alice",
      twitchUserId: "twitch456",
      profileImageUrl: "https://example.com/avatar.png",
      channelDescription: "My awesome channel",
      scope: "chat:read chat:write",
    });

    expect(created.username).toBe("Alice");
    expect(created.twitchUserId).toBe("twitch456");
    expect(created.profileImageUrl).toBe("https://example.com/avatar.png");
    expect(created.channelDescription).toBe("My awesome channel");
    expect(created.scope).toBe("chat:read chat:write");
  });

  it("adding multiple users creates separate entries", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const a = await service.addUser({
      username: "Bobby",
      twitchUserId: "twitch001",
    });
    const b = await service.addUser({
      username: "Robert",
      twitchUserId: "twitch002",
    });

    expect(a.id).not.toBe(b.id);
    expect(b.username).toBe("Robert");
  });

  // ============ NEW: Tests for getChannelsByUserId ============

  it("should return empty array when user has no channels", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      username: "NoChannelUser",
      twitchUserId: "twitch789",
    });

    const channels = await service.getChannelsByUserId(user.id);
    expect(channels).toEqual([]);
  });

  it("should return channels for a user", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      username: "ChannelUser",
      twitchUserId: "twitch111",
    });
    const channel1 = await mockDb.addChannel({ name: "Channel One" });
    const channel2 = await mockDb.addChannel({ name: "Channel Two" });

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
  });

  // ============ NEW: Tests for getBadgesByUserId ============

  it("should return empty array when user has no badges", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      username: "NoBadgeUser",
      twitchUserId: "twitch222",
    });

    const badges = await service.getBadgesByUserId(user.id);
    expect(badges).toEqual([]);
  });

  it("should return badges for a user", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      username: "BadgeUser",
      twitchUserId: "twitch333",
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

  // ============ NEW: Tests for getAchievementsByUserId ============

  it("should return empty array when user has no achievements", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      username: "NoAchievementUser",
      twitchUserId: "twitch444",
    });

    const achievements = await service.getAchievementsByUserId(user.id);
    expect(achievements).toEqual([]);
  });

  it("should return achievements for a user", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user = await service.addUser({
      username: "AchievementUser",
      twitchUserId: "twitch555",
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

  // ============ NEW: Tests for getUsersByChannelId ============

  it("should return empty array when channel has no users", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const channel = await mockDb.addChannel({ name: "Empty Channel" });

    const users = await service.getUsersByChannelId(channel.id);
    expect(users).toEqual([]);
  });

  it("should return users for a channel", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user1 = await service.addUser({
      username: "User1",
      twitchUserId: "twitch666",
    });
    const user2 = await service.addUser({
      username: "User2",
      twitchUserId: "twitch777",
    });
    const channel = await mockDb.addChannel({ name: "Popular Channel" });

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
  });

  // ============ NEW: Tests for getUsersByBadgeId ============

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
      username: "BadgeOwner1",
      twitchUserId: "twitch888",
    });
    const user2 = await service.addUser({
      username: "BadgeOwner2",
      twitchUserId: "twitch999",
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

  // ============ NEW: Tests for getUsersByAchievementId ============

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

  it("should return users who have an achievement", async () => {
    const mockDb = new MockDatabase();
    const service = new UserRepository(mockDb);

    const user1 = await service.addUser({
      username: "Achiever1",
      twitchUserId: "twitchA01",
    });
    const user2 = await service.addUser({
      username: "Achiever2",
      twitchUserId: "twitchA02",
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
