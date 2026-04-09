import { PrismaDatabase } from "../../database/prismaDatabase";
import { UserRepository } from "../../repositories/userRepository";

describe("UserRepository (integration: Prisma + MySQL)", () => {
  const db = new PrismaDatabase();
  const service = new UserRepository(db);

  let type1: { id: string; label: string; data: string };
  let type2: { id: string; label: string; data: string };
  let type3: { id: string; label: string; data: string };
  beforeAll(async () => {
    type1 = await db.addTypeAchievement({ label: "TL", data: "TD" });
    type2 = await db.addTypeAchievement({ label: "TL2", data: "TD2" });
    type3 = await db.addTypeAchievement({ label: "TL3", data: "TD3" });
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should return all achievements for a channel via getAchievementsByChannelId", async () => {
    const channel = await db.addChannel({
      id: "ch-ach-" + Date.now(),
      name: "TestChannelForAchievements",
    });
    const achievement1 = (await db.addAchievement({
      title: "ChannelAch1",
      description: "First channel achievement",
      goal: 1,
      reward: 10,
      label: "label1",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type1.id,
    }))!;
    const achievement2 = (await db.addAchievement({
      title: "ChannelAch2",
      description: "Second channel achievement",
      goal: 2,
      reward: 20,
      label: "label2",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type2.id,
    }))!;
    const otherChannel = await db.addChannel({
      id: "ch-other-" + Date.now(),
      name: "OtherChannelForAchievements",
    });
    await db.addAchievement({
      title: "OtherChannelAch",
      description: "Other channel achievement",
      goal: 3,
      reward: 30,
      label: "label3",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: otherChannel.id,
      typeId: type3.id,
    });
    const achievements = await service.getAchievementsByChannelId(channel.id);
    expect(achievements.length).toBeGreaterThanOrEqual(2);
    const titles = achievements.map((a) => a.title);
    expect(titles).toContain("ChannelAch1");
    expect(titles).toContain("ChannelAch2");
    expect(titles).not.toContain("OtherChannelAch");
    achievements.forEach((a) => {
      expect(a).toHaveProperty("typeAchievement");
    });
  });

  it("should return getAchievementsByUserAndChannel with full merged data", async () => {
    const user = await service.addUser({
      id: "twitch_merged_user",
      username: "MergedUser_" + Date.now(),
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await db.addChannel({
      id: "ch-merged-" + Date.now(),
      name: "MergedChannel_" + Date.now(),
    });
    const achievement1 = (await db.addAchievement({
      title: "MergedAch1",
      description: "d1",
      goal: 1,
      reward: 10,
      label: "l1",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type1.id,
    }))!;
    await db.addAchievement({
      title: "MergedAch2",
      description: "d2",
      goal: 2,
      reward: 20,
      label: "l2",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type2.id,
    });
    await db.addAchieved({
      achievementId: achievement1.id,
      userId: user.id,
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    const data = await service.getAchievementsByUserAndChannel(
      user.id,
      channel.id,
    );
    expect(data.userId).toBe(user.id);
    expect(data.channelId).toBe(channel.id);
    expect(data.achievements.length).toBe(2);
    const withProgress = data.achievements.find(
      (a) => a.id === achievement1.id,
    );
    expect(withProgress?.achieved).not.toBeNull();
    expect(withProgress?.achieved?.count).toBe(1);
    const withoutProgress = data.achievements.find(
      (a) => a.id !== achievement1.id,
    );
    expect(withoutProgress?.achieved).toBeNull();
    data.achievements.forEach((a) => {
      expect(a).toHaveProperty("typeAchievement");
    });
  });

  it("should return all achieved records for a user and channelIds via getAchievedByUserAndChannels", async () => {
    const user = await service.addUser({
      id: "twitch_achieved_user",
      username: "AchievedUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel1 = await db.addChannel({
      id: "ch-ach1-" + Date.now(),
      name: "AchievedChannel1",
    });
    const channel2 = await db.addChannel({
      id: "ch-ach2-" + Date.now(),
      name: "AchievedChannel2",
    });
    const achievement1 = (await db.addAchievement({
      title: "Achieved1",
      description: "desc1",
      goal: 1,
      reward: 10,
      label: "l1",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel1.id,
      typeId: type1.id,
    }))!;
    const achievement2 = (await db.addAchievement({
      title: "Achieved2",
      description: "desc2",
      goal: 2,
      reward: 20,
      label: "l2",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel2.id,
      typeId: type2.id,
    }))!;
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
      id: "twitch_other_user",
      username: "OtherUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
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
      id: "twitch_integ_001",
      username: "IntegrationUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const fetched = await service.getUserById(u.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe("twitch_integ_001");
    expect(fetched?.username).toBe("IntegrationUser");
    expect(fetched?.profileImageUrl).toBeNull();
    expect(fetched?.channelDescription).toBeNull();
    expect(fetched?.scope).toBeNull();
    expect(fetched?.xp).toBe(0);
  });

  it("should add user with all optional fields", async () => {
    const u = await service.addUser({
      id: "twitch_integ_002",
      username: "FullUser",
      profileImageUrl: "https://example.com/img.png",
      channelDescription: "A test channel",
      scope: "chat:read user:read",
      xp: 42,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const fetched = await service.getUserById(u.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.profileImageUrl).toBe("https://example.com/img.png");
    expect(fetched?.channelDescription).toBe("A test channel");
    expect(fetched?.scope).toBe("chat:read user:read");
    expect(fetched?.xp).toBe(42);
  });

  it("should return channels with userType for a user via getChannelsByUserId", async () => {
    const user = await service.addUser({
      id: "twitch_integ_003",
      username: "ChannelIntegUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await db.addChannel({
      id: "ch-integ-" + Date.now(),
      name: "IntegChannel",
    });
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
      id: "twitch_integ_003b",
      username: "MultiChannelIntegUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const modChannel = await db.addChannel({
      id: "ch-mod-" + Date.now(),
      name: "ModeratorChannel",
    });
    const adminChannel = await db.addChannel({
      id: "ch-admin-" + Date.now(),
      name: "AdminChannel",
    });

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
      id: "twitch_integ_004",
      username: "BadgeIntegUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const chId004 = "ch_badge_integ_004_" + Date.now();
    await db.addChannel({ id: chId004, name: "BadgeIntegCh" });
    const badge = (await db.addBadge({
      title: "IntegBadge",
      img: "badge.png",
      channelId: chId004,
    }))!;
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
      id: "twitch_integ_005",
      username: "AchievementIntegUser",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await db.addChannel({
      id: "ch-achusr-" + Date.now(),
      name: "AchievementUserChannel",
    });
    const achievement = (await db.addAchievement({
      title: "IntegAchievement",
      description: "Integration test achievement",
      goal: 10,
      reward: 100,
      label: "test",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type1.id,
    }))!;
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
      id: "twitch_integ_006",
      username: "ChannelMember",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await db.addChannel({
      id: "ch-member-" + Date.now(),
      name: "MemberChannel",
    });
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
      id: "twitch_integ_admin",
      username: "ChannelAdmin",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const mod = await service.addUser({
      id: "twitch_integ_mod",
      username: "ChannelMod",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await db.addChannel({
      id: "ch-multi-" + Date.now(),
      name: "MultiUserChannel",
    });

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
      id: "twitch_integ_007",
      username: "BadgeHolder",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const chId007 = "ch_badge_integ_007_" + Date.now();
    await db.addChannel({ id: chId007, name: "HolderCh" });
    const badge = (await db.addBadge({
      title: "HolderBadge",
      img: "holder.png",
      channelId: chId007,
    }))!;
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
      id: "twitch_integ_008",
      username: "AchievementHolder",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const channel = await db.addChannel({
      id: "ch-holder-" + Date.now(),
      name: "HolderAchievementChannel",
    });
    const achievement = (await db.addAchievement({
      title: "HolderAchievement",
      description: "Test holder",
      goal: 1,
      reward: 50,
      label: "holder",
      public: false,
      active: true,
      secret: false,
      image: "img.png",
      channelId: channel.id,
      typeId: type1.id,
    }))!;
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

  // ── nukeUser (GDPR) ─────────────────────────────────────────────────

  it("should atomically delete all data related to a user", async () => {
    const ts = Date.now();

    // Create the target user and another user
    const target = await service.addUser({
      id: `twitch_nuke_${ts}`,
      username: `nuke_target_${ts}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const other = await service.addUser({
      id: `twitch_other_${ts}`,
      username: `other_user_${ts}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    // Target's channel
    const targetChannel = await db.addChannel({
      id: target.id,
      name: `nukeCh_${ts}`,
    });

    // Other user's channel
    const otherChannel = await db.addChannel({
      id: other.id,
      name: `otherCh_${ts}`,
    });

    // Achievements on target's channel
    const ach1 = (await db.addAchievement({
      title: `NukeAch1_${ts}`,
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
      public: false,
      active: true,
      secret: false,
      image: "",
      channelId: targetChannel.id,
      typeId: type1.id,
    }))!;
    const ach2 = (await db.addAchievement({
      title: `NukeAch2_${ts}`,
      description: "d",
      goal: 2,
      reward: 2,
      label: "l2",
      public: false,
      active: true,
      secret: false,
      image: "",
      channelId: targetChannel.id,
      typeId: type2.id,
    }))!;

    // Achievement on other channel (should survive)
    const otherAch = (await db.addAchievement({
      title: `OtherAch_${ts}`,
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
      public: false,
      active: true,
      secret: false,
      image: "",
      channelId: otherChannel.id,
      typeId: type3.id,
    }))!;

    // Badge on target's channel
    const targetBadge = (await db.addBadge({
      title: `NukeBadge_${ts}`,
      img: "nb.png",
      channelId: targetChannel.id,
    }))!;

    // Badge on other channel (should survive)
    const otherBadge = (await db.addBadge({
      title: `OtherBadge_${ts}`,
      img: "ob.png",
      channelId: otherChannel.id,
    }))!;

    // Target's own achieved, possesses, are
    await db.addAchieved({
      achievementId: ach1.id,
      userId: target.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    await db.addPossesses({
      userId: target.id,
      badgeId: targetBadge.id,
      acquiredDate: new Date().toISOString(),
    });
    await db.addAre({
      userId: target.id,
      channelId: targetChannel.id,
      userType: "admin",
    });
    // Target also a member of other channel
    await db.addAre({
      userId: target.id,
      channelId: otherChannel.id,
      userType: "viewer",
    });
    // Target achieved on other channel
    await db.addAchieved({
      achievementId: otherAch.id,
      userId: target.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    // Target possesses other badge
    await db.addPossesses({
      userId: target.id,
      badgeId: otherBadge.id,
      acquiredDate: new Date().toISOString(),
    });

    // Other user linked to target's channel
    await db.addAchieved({
      achievementId: ach1.id,
      userId: other.id,
      count: 2,
      finished: true,
      labelActive: false,
      acquiredDate: new Date().toISOString(),
    });
    await db.addAchieved({
      achievementId: ach2.id,
      userId: other.id,
      count: 3,
      finished: true,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    await db.addPossesses({
      userId: other.id,
      badgeId: targetBadge.id,
      acquiredDate: new Date().toISOString(),
    });
    await db.addAre({
      userId: other.id,
      channelId: targetChannel.id,
      userType: "viewer",
    });

    // Other user also has records on their own channel (should survive)
    await db.addAchieved({
      achievementId: otherAch.id,
      userId: other.id,
      count: 1,
      finished: false,
      labelActive: true,
      acquiredDate: new Date().toISOString(),
    });
    await db.addPossesses({
      userId: other.id,
      badgeId: otherBadge.id,
      acquiredDate: new Date().toISOString(),
    });
    await db.addAre({
      userId: other.id,
      channelId: otherChannel.id,
      userType: "admin",
    });

    // ── Nuke! ──
    const result = await service.nukeUser(target.id);
    expect(result).toBe(true);

    // Target user gone
    expect(await db.getUserById(target.id)).toBeNull();

    // Target channel gone
    expect(await db.getChannelById(target.id)).toBeNull();

    // Target's achievements gone
    expect(await db.getAchievementById(ach1.id)).toBeNull();
    expect(await db.getAchievementById(ach2.id)).toBeNull();

    // Target's badge gone
    expect(await db.getBadgeById(targetBadge.id)).toBeNull();

    // Other user's achieved on target's achievements gone
    expect(await db.getAchieved(ach1.id, other.id)).toBeNull();
    expect(await db.getAchieved(ach2.id, other.id)).toBeNull();

    // Other user's possesses for target's badge gone
    expect(await db.getPossesses(other.id, targetBadge.id)).toBeNull();

    // Other user's are on target's channel gone
    expect(await db.getAre(other.id, targetChannel.id)).toBeNull();

    // Target's are on other channel gone
    expect(await db.getAre(target.id, otherChannel.id)).toBeNull();

    // Target's achieved on other achievements gone
    expect(await db.getAchieved(otherAch.id, target.id)).toBeNull();

    // Target's possesses for other badge gone
    expect(await db.getPossesses(target.id, otherBadge.id)).toBeNull();

    // ── Other user's own data SURVIVES ──
    expect(await db.getUserById(other.id)).not.toBeNull();
    expect(await db.getChannelById(other.id)).not.toBeNull();
    expect(await db.getAchievementById(otherAch.id)).not.toBeNull();
    expect(await db.getBadgeById(otherBadge.id)).not.toBeNull();
    expect(await db.getAchieved(otherAch.id, other.id)).not.toBeNull();
    expect(await db.getPossesses(other.id, otherBadge.id)).not.toBeNull();
    expect(await db.getAre(other.id, otherChannel.id)).not.toBeNull();

    // Type achievements survive
    expect(await db.getTypeAchievementById(type1.id)).not.toBeNull();
    expect(await db.getTypeAchievementById(type2.id)).not.toBeNull();
    expect(await db.getTypeAchievementById(type3.id)).not.toBeNull();
  });

  it("nukeUser returns false for non-existent user", async () => {
    expect(await service.nukeUser("nonexistent_user_xyz")).toBe(false);
  });

  it("second nukeUser on the same user returns false (idempotent)", async () => {
    const ts = Date.now();
    await service.addUser({
      id: `twitch_double_${ts}`,
      username: `double_${ts}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    expect(await service.nukeUser(`twitch_double_${ts}`)).toBe(true);
    expect(await service.nukeUser(`twitch_double_${ts}`)).toBe(false);
  });

  it("cleans linked data for multiple other users on the target's channel", async () => {
    const ts = Date.now();

    const target = await service.addUser({
      id: `twitch_mt_${ts}`,
      username: `mt_target_${ts}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const other1 = await service.addUser({
      id: `twitch_mt_o1_${ts}`,
      username: `mt_o1_${ts}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const other2 = await service.addUser({
      id: `twitch_mt_o2_${ts}`,
      username: `mt_o2_${ts}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    await db.addChannel({ id: target.id, name: `mtCh_${ts}` });
    const ach = (await db.addAchievement({
      title: `MtAch_${ts}`,
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
      public: false,
      active: true,
      secret: false,
      image: "",
      channelId: target.id,
      typeId: type1.id,
    }))!;
    const badge = (await db.addBadge({
      title: `MtBadge_${ts}`,
      img: "b.png",
      channelId: target.id,
    }))!;

    // Both other users participate in target's channel
    for (const u of [other1, other2]) {
      await db.addAchieved({
        achievementId: ach.id,
        userId: u.id,
        count: 1,
        finished: false,
        labelActive: true,
        acquiredDate: new Date().toISOString(),
      });
      await db.addPossesses({
        userId: u.id,
        badgeId: badge.id,
        acquiredDate: new Date().toISOString(),
      });
      await db.addAre({
        userId: u.id,
        channelId: target.id,
        userType: "viewer",
      });
    }

    expect(await service.nukeUser(target.id)).toBe(true);

    // Both other users' linked data must be cleaned
    for (const u of [other1, other2]) {
      expect(await db.getAchieved(ach.id, u.id)).toBeNull();
      expect(await db.getPossesses(u.id, badge.id)).toBeNull();
      expect(await db.getAre(u.id, target.id)).toBeNull();
    }

    // Both other users themselves survive
    expect(await db.getUserById(other1.id)).not.toBeNull();
    expect(await db.getUserById(other2.id)).not.toBeNull();
  });
});
