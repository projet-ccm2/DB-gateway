import { handleJsonMessage, GatewayRepo } from "../../../handler/jsonHandler";
import type {
  userDTO,
  channelDTO,
  channelUserDTO,
  typeAchievementDTO,
  achievementDTO,
  badgeDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "../../../database/database";

function makeRepoMock(): GatewayRepo {
  const users: userDTO[] = [];
  const channels: channelDTO[] = [];
  const typeAchievements: typeAchievementDTO[] = [];
  const achievements: achievementDTO[] = [];
  const badges: (badgeDTO & { channelId?: string })[] = [];
  const achieved: achievedDTO[] = [];
  const are: areDTO[] = [];
  const possesses: possessesDTO[] = [];

  return {
    user: {
      addUser: async (user: {
        id: string;
        username: string;
        lastUpdateTimestamp: string;
        profileImageUrl?: string | null;
        channelDescription?: string | null;
        scope?: string | null;
        xp?: number;
      }) => {
        const u: userDTO = {
          id: user.id,
          username: user.username,
          lastUpdateTimestamp: user.lastUpdateTimestamp,
          profileImageUrl: user.profileImageUrl ?? null,
          channelDescription: user.channelDescription ?? null,
          scope: user.scope ?? null,
          xp: user.xp ?? 0,
        };
        users.push(u);
        return u;
      },
      getUserById: async (id: string) => users.find((u) => u.id === id) ?? null,
      getAllUsers: async () => users,
      updateUser: async (
        id: string,
        data: {
          username?: string;
          profileImageUrl?: string | null;
          channelDescription?: string | null;
          scope?: string | null;
          xp?: number;
          lastUpdateTimestamp?: string;
        },
      ) => {
        const user = users.find((u) => u.id === id);
        if (!user) return null;
        if (data.username !== undefined) user.username = data.username;
        if (data.profileImageUrl !== undefined)
          user.profileImageUrl = data.profileImageUrl;
        if (data.channelDescription !== undefined)
          user.channelDescription = data.channelDescription;
        if (data.scope !== undefined) user.scope = data.scope;
        if (data.xp !== undefined) user.xp = data.xp;
        if (data.lastUpdateTimestamp !== undefined)
          user.lastUpdateTimestamp = data.lastUpdateTimestamp;
        return user;
      },
      getChannelsByUserId: async (userId: string) =>
        are
          .filter((a) => a.userId === userId)
          .map((a) => {
            const ch = channels.find((c) => c.id === a.channelId);
            return { id: ch!.id, name: ch!.name, userType: a.userType };
          }),
      getBadgesByUserId: async (userId: string) =>
        badges.filter((b) =>
          possesses.some((p) => p.userId === userId && p.badgeId === b.id),
        ),
      getAchievementsByUserId: async (userId: string) =>
        achieved.filter((a) => a.userId === userId),
      getUsersByChannelId: async (channelId: string) =>
        are
          .filter((a) => a.channelId === channelId)
          .map((a) => {
            const user = users.find((u) => u.id === a.userId);
            return {
              id: user!.id,
              username: user!.username,
              lastUpdateTimestamp: user!.lastUpdateTimestamp,
              profileImageUrl: user!.profileImageUrl ?? null,
              channelDescription: user!.channelDescription ?? null,
              scope: user!.scope ?? null,
              xp: user!.xp,
              userType: a.userType,
            };
          }),
      getUsersByBadgeId: async (badgeId: string) =>
        users.filter((u) =>
          possesses.some((p) => p.badgeId === badgeId && p.userId === u.id),
        ),
      getUsersByAchievementId: async (achievementId: string) =>
        users.filter((u) =>
          achieved.some(
            (a) => a.achievementId === achievementId && a.userId === u.id,
          ),
        ),
    },
    channel: {
      addChannel: async (
        id: string,
        name: string,
        discordWebhookUrl?: string | null,
      ) => {
        const c = {
          id,
          name,
          discordWebhookUrl: discordWebhookUrl ?? null,
        };
        channels.push(c);
        return c;
      },
      getChannelById: async (id: string) =>
        channels.find((c) => c.id === id) ?? null,
      updateChannel: async (
        id: string,
        data: { name?: string; discordWebhookUrl?: string | null },
      ) => {
        const channel = channels.find((c) => c.id === id);
        if (!channel) return null;
        if (data.name !== undefined) channel.name = data.name;
        if (data.discordWebhookUrl !== undefined)
          channel.discordWebhookUrl = data.discordWebhookUrl ?? null;
        return channel;
      },
      getBadgeByChannelId: async (channelId: string) => {
        const b = badges.find((b) => b.channelId === channelId);
        if (!b) return null;
        return { id: b.id, title: b.title, img: b.img };
      },
    },
    typeAchievement: {
      addTypeAchievement: async (label: string, data: string) => {
        const t = { id: "t_" + label, label, data };
        typeAchievements.push(t);
        return t;
      },
      getTypeAchievementById: async (id: string) =>
        typeAchievements.find((t) => t.id === id) ?? null,
    },
    achievement: {
      addAchievement: async (a) => {
        const typeAch = typeAchievements.find((t) => t.id === a.typeId);
        if (!typeAch) return null;
        const ach = {
          id: "a_" + a.title,
          ...a,
          downloads: 0,
          visits: 0,
          channelId: a.channelId ?? null,
          typeAchievement: typeAch,
        };
        achievements.push(ach);
        return ach;
      },
      getAchievementById: async (id: string) =>
        achievements.find((a) => a.id === id) ?? null,
      updateAchievementActive: async (id: string, active: boolean) => {
        const ach = achievements.find((a) => a.id === id);
        if (!ach) return null;
        ach.active = active;
        return ach;
      },
      updateAchievementPublic: async (id: string, isPublic: boolean) => {
        const ach = achievements.find((a) => a.id === id);
        if (!ach) return null;
        ach.public = isPublic;
        return ach;
      },
      updateAchievement: async (
        id: string,
        data: {
          title?: string;
          description?: string;
          goal?: number;
          reward?: number;
          label?: string;
          public?: boolean;
          active?: boolean;
          secret?: boolean;
          image?: string;
          typeId?: string;
        },
      ) => {
        const ach = achievements.find((a) => a.id === id);
        if (!ach) return null;
        if (data.title !== undefined) ach.title = data.title;
        if (data.description !== undefined) ach.description = data.description;
        if (data.goal !== undefined) ach.goal = data.goal;
        if (data.reward !== undefined) ach.reward = data.reward;
        if (data.label !== undefined) ach.label = data.label;
        if (data.public !== undefined) ach.public = data.public;
        if (data.active !== undefined) ach.active = data.active;
        if (data.secret !== undefined) ach.secret = data.secret;
        if (data.image !== undefined) ach.image = data.image;
        if (data.typeId !== undefined) {
          const newType = typeAchievements.find((t) => t.id === data.typeId);
          if (newType) ach.typeAchievement = newType;
        }
        return ach;
      },
      getPublicAchievements: async () => {
        return achievements.filter((a) => a.public === true);
      },
      getAchievementDefinitionsByUserId: async (userId: string) => {
        const userAchievedIds = new Set(
          achieved
            .filter((a) => a.userId === userId)
            .map((a) => a.achievementId),
        );
        return achievements
          .filter((a) => userAchievedIds.has(a.id))
          .map((a) => ({
            ...a,
            achieved:
              achieved.find(
                (ac) => ac.achievementId === a.id && ac.userId === userId,
              ) ?? null,
          }));
      },
      deleteAchievement: async (id: string) => {
        const idx = achievements.findIndex((a) => a.id === id);
        if (idx === -1) return null;
        const [removed] = achievements.splice(idx, 1);
        return removed;
      },
    },
    badge: {
      addBadge: async (title: string, img: string, channelId: string) => {
        const b = {
          id: "b_" + title,
          title,
          img,
          channelId,
        };
        badges.push(b);
        return { id: b.id, title: b.title, img: b.img };
      },
      getBadgeById: async (id: string) => {
        const b = badges.find((b) => b.id === id);
        if (!b) return null;
        return { id: b.id, title: b.title, img: b.img };
      },
    },
    achieved: {
      addAchieved: async (a: achievedDTO) => {
        achieved.push(a);
        return a;
      },
      getAchieved: async (achievementId: string, userId: string) =>
        achieved.find(
          (a) => a.achievementId === achievementId && a.userId === userId,
        ) ?? null,
    },
    are: {
      addAre: async (userId: string, channelId: string, userType: string) => {
        const r = { userId, channelId, userType };
        are.push(r);
        return r;
      },
      getAre: async (userId: string, channelId: string) =>
        are.find((r) => r.userId === userId && r.channelId === channelId) ??
        null,
      getAreByUserId: async (userId: string) =>
        are.filter((r) => r.userId === userId),
      getAreByChannelId: async (channelId: string) =>
        are.filter((r) => r.channelId === channelId),
      updateAre: async (
        userId: string,
        channelId: string,
        data: { userType?: string },
      ) => {
        const record = are.find(
          (r) => r.userId === userId && r.channelId === channelId,
        );
        if (!record) return null;
        if (data.userType !== undefined) record.userType = data.userType;
        return record;
      },
      deleteAre: async (userId: string, channelId: string) => {
        const index = are.findIndex(
          (r) => r.userId === userId && r.channelId === channelId,
        );
        if (index === -1) return false;
        are.splice(index, 1);
        return true;
      },
    },
    possesses: {
      addPossesses: async (
        userId: string,
        badgeId: string,
        acquiredDate: string,
      ) => {
        const p = { userId, badgeId, acquiredDate };
        possesses.push(p);
        return p;
      },
      getPossesses: async (userId: string, badgeId: string) =>
        possesses.find((p) => p.userId === userId && p.badgeId === badgeId) ??
        null,
    },
  };
}

describe("jsonHandler full coverage", () => {
  let repo: GatewayRepo;

  beforeEach(async () => {
    repo = makeRepoMock();
    // Seed types used by achievement tests
    await repo.typeAchievement.addTypeAchievement("TL", "TD");
    await repo.typeAchievement.addTypeAchievement("NTL", "NTD");
  });

  test("user create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_bob",
        username: "bob",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getUser",
      payload: { userId: "twitch_bob" },
    });
    expect(get.ok).toBe(true);
  });

  test("user create with all fields", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_alice",
        username: "alice",
        profileImageUrl: "https://img.com/alice.png",
        channelDescription: "Alice's channel",
        scope: "chat:read",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    expect(create.ok).toBe(true);
    if (!create.ok) return;
    expect(create.user?.profileImageUrl).toBe("https://img.com/alice.png");
    expect(create.user?.channelDescription).toBe("Alice's channel");
    expect(create.user?.scope).toBe("chat:read");
  });

  test("getChannelsByUserId with userType", async () => {
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_chuser",
        username: "chuser",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { id: "c_testchan", name: "testchan" },
    });
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: {
        userId: "twitch_chuser",
        channelId: "c_testchan",
        userType: "moderator",
      },
    });

    const result = await handleJsonMessage(repo, {
      action: "getChannelsByUserId",
      payload: { userId: "twitch_chuser" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.channels).toHaveLength(1);
    expect(result.channels![0].name).toBe("testchan");
    expect(result.channels![0].userType).toBe("moderator");
  });

  test("getBadgesByUserId", async () => {
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_badgeuser",
        username: "badgeuser",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    await handleJsonMessage(repo, {
      action: "createBadge",
      payload: {
        title: "testbadge",
        img: "badge.png",
        channelId: "ch_testbadge",
      },
    });
    await handleJsonMessage(repo, {
      action: "createPossesses",
      payload: {
        userId: "twitch_badgeuser",
        badgeId: "b_testbadge",
        acquiredDate: "2024-01-01T00:00:00Z",
      },
    });

    const result = await handleJsonMessage(repo, {
      action: "getBadgesByUserId",
      payload: { userId: "twitch_badgeuser" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.badges).toHaveLength(1);
    expect(result.badges![0].title).toBe("testbadge");
  });

  test("getAchievementsByUserId", async () => {
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_achuser",
        username: "achuser",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    await handleJsonMessage(repo, {
      action: "createAchieved",
      payload: {
        userId: "twitch_achuser",
        achievementId: "a1",
        count: 1,
        finished: true,
        labelActive: true,
        acquiredDate: "2024-01-01T00:00:00Z",
      },
    });

    const result = await handleJsonMessage(repo, {
      action: "getAchievementsByUserId",
      payload: { userId: "twitch_achuser" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.achievedRecords).toHaveLength(1);
    expect(
      (result.achievedRecords![0] as { achievementId: string }).achievementId,
    ).toBe("a1");
  });

  test("getUsersByChannelId with userType", async () => {
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_chanmember",
        username: "chanmember",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { id: "c_popchan", name: "popchan" },
    });
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: {
        userId: "twitch_chanmember",
        channelId: "c_popchan",
        userType: "subscriber",
      },
    });

    const result = await handleJsonMessage(repo, {
      action: "getUsersByChannelId",
      payload: { channelId: "c_popchan" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.users).toHaveLength(1);
    expect(result.users![0].username).toBe("chanmember");
    expect((result.users![0] as channelUserDTO).userType).toBe("subscriber");
  });

  test("getUsersByBadgeId", async () => {
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_badgeholder",
        username: "badgeholder",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    await handleJsonMessage(repo, {
      action: "createBadge",
      payload: {
        title: "rarebadge",
        img: "rare.png",
        channelId: "ch_rarebadge",
      },
    });
    await handleJsonMessage(repo, {
      action: "createPossesses",
      payload: {
        userId: "twitch_badgeholder",
        badgeId: "b_rarebadge",
        acquiredDate: "2024-01-01T00:00:00Z",
      },
    });

    const result = await handleJsonMessage(repo, {
      action: "getUsersByBadgeId",
      payload: { badgeId: "b_rarebadge" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.users).toHaveLength(1);
    expect(result.users![0].username).toBe("badgeholder");
  });

  test("getUsersByAchievementId", async () => {
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_achiever",
        username: "achiever",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    await handleJsonMessage(repo, {
      action: "createAchieved",
      payload: {
        achievementId: "achtest1",
        userId: "twitch_achiever",
        count: 1,
        finished: true,
        labelActive: true,
        acquiredDate: "2024-01-01T00:00:00Z",
      },
    });

    const result = await handleJsonMessage(repo, {
      action: "getUsersByAchievementId",
      payload: { achievementId: "achtest1" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.users).toHaveLength(1);
    expect(result.users![0].username).toBe("achiever");
  });

  test("channel create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { id: "c_chan1", name: "chan1" },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getChannel",
      payload: { channelId: "c_chan1" },
    });
    expect(get.ok).toBe(true);
  });

  test("channel update", async () => {
    await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { id: "c_upd", name: "OldName" },
    });
    const update = await handleJsonMessage(repo, {
      action: "updateChannel",
      payload: { channelId: "c_upd", name: "NewName" },
    });
    expect(update.ok).toBe(true);
    if (update.ok) {
      expect(update.channel?.name).toBe("NewName");
    }
  });

  test("channel create with discordWebhookUrl", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createChannel",
      payload: {
        id: "c_wh",
        name: "whchan",
        discordWebhookUrl: "https://discord.com/api/webhooks/handler",
      },
    });
    expect(create.ok).toBe(true);
    if (create.ok) {
      expect(create.channel?.discordWebhookUrl).toBe(
        "https://discord.com/api/webhooks/handler",
      );
    }
  });

  test("channel update discordWebhookUrl", async () => {
    await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { id: "c_upd_wh", name: "UW" },
    });
    const update = await handleJsonMessage(repo, {
      action: "updateChannel",
      payload: {
        channelId: "c_upd_wh",
        discordWebhookUrl: "https://discord.com/api/webhooks/updated",
      },
    });
    expect(update.ok).toBe(true);
    if (update.ok) {
      expect(update.channel?.discordWebhookUrl).toBe(
        "https://discord.com/api/webhooks/updated",
      );
    }
  });

  test("getBadgeByChannelId returns null for unknown channel", async () => {
    const res = await handleJsonMessage(repo, {
      action: "getBadgeByChannelId",
      payload: { channelId: "no-channel" },
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.badge).toBeNull();
    }
  });

  test("getBadgeByChannelId returns badge when linked", async () => {
    await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { id: "ch_linked", name: "LinkedChannel" },
    });
    await handleJsonMessage(repo, {
      action: "createBadge",
      payload: {
        title: "linked_badge",
        img: "linked.png",
        channelId: "ch_linked",
      },
    });
    const res = await handleJsonMessage(repo, {
      action: "getBadgeByChannelId",
      payload: { channelId: "ch_linked" },
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.badge).not.toBeNull();
      expect(res.badge?.title).toBe("linked_badge");
    }
  });

  test("typeAchievement create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createTypeAchievement",
      payload: { label: "L", data: "D" },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getTypeAchievement",
      payload: { typeAchievementId: "t_L" },
    });
    expect(get.ok).toBe(true);
  });

  test("achievement create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 2,
        label: "lab",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "t_TL",
      },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getAchievement",
      payload: { achievementId: "a_T" },
    });
    expect(get.ok).toBe(true);
  });

  test("achievement activate/deactivate", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "Toggle",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "t_TL",
      },
    });
    expect(create.ok).toBe(true);

    const deactivate = await handleJsonMessage(repo, {
      action: "deactivateAchievement",
      payload: { achievementId: "a_Toggle" },
    });
    expect(deactivate.ok).toBe(true);
    expect(
      (deactivate as { achievement: { active: boolean } }).achievement.active,
    ).toBe(false);

    const activate = await handleJsonMessage(repo, {
      action: "activateAchievement",
      payload: { achievementId: "a_Toggle" },
    });
    expect(activate.ok).toBe(true);
    expect(
      (activate as { achievement: { active: boolean } }).achievement.active,
    ).toBe(true);
  });

  test("achievement activate returns not found for unknown id", async () => {
    const result = await handleJsonMessage(repo, {
      action: "activateAchievement",
      payload: { achievementId: "unknown" },
    });
    expect(result.ok).toBe(false);
  });

  test("achievement public/private", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "ToggleVis",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "t_TL",
      },
    });
    expect(create.ok).toBe(true);

    const makePublic = await handleJsonMessage(repo, {
      action: "publicAchievement",
      payload: { achievementId: "a_ToggleVis" },
    });
    expect(makePublic.ok).toBe(true);
    expect(
      (makePublic as { achievement: { public: boolean } }).achievement.public,
    ).toBe(true);

    const makePrivate = await handleJsonMessage(repo, {
      action: "privateAchievement",
      payload: { achievementId: "a_ToggleVis" },
    });
    expect(makePrivate.ok).toBe(true);
    expect(
      (makePrivate as { achievement: { public: boolean } }).achievement.public,
    ).toBe(false);
  });

  test("achievement public returns not found for unknown id", async () => {
    const result = await handleJsonMessage(repo, {
      action: "publicAchievement",
      payload: { achievementId: "unknown" },
    });
    expect(result.ok).toBe(false);
  });

  test("getPublicAchievements returns only public achievements", async () => {
    await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "MarketPub",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: true,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "t_TL",
      },
    });
    await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "MarketPriv",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "t_TL",
      },
    });
    const result = await handleJsonMessage(repo, {
      action: "getPublicAchievements",
      payload: {},
    });
    expect(result.ok).toBe(true);
    const achievements = (
      result as unknown as { achievementsWithType: Array<{ public: boolean }> }
    ).achievementsWithType;
    expect(achievements.length).toBeGreaterThanOrEqual(1);
    expect(achievements.every((a) => a.public === true)).toBe(true);
  });

  test("getAchievementDefinitionsByUserId returns achievements with achieved data", async () => {
    const createRes = await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "DefByUser",
        description: "D",
        goal: 5,
        reward: 10,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "img.png",
        typeId: "t_TL",
      },
    });
    const achId = (createRes as unknown as { achievement: { id: string } })
      .achievement.id;
    await handleJsonMessage(repo, {
      action: "createAchieved",
      payload: {
        achievementId: achId,
        userId: "defUser1",
        count: 3,
        finished: false,
        labelActive: true,
        acquiredDate: "2024-06-01T00:00:00.000Z",
      },
    });
    const result = await handleJsonMessage(repo, {
      action: "getAchievementDefinitionsByUserId",
      payload: { userId: "defUser1" },
    });
    expect(result.ok).toBe(true);
    const achs = (
      result as unknown as {
        achievementDefinitions: Array<{
          title: string;
          achieved: { userId: string } | null;
        }>;
      }
    ).achievementDefinitions;
    expect(achs.length).toBeGreaterThanOrEqual(1);
    const match = achs.find((a) => a.title === "DefByUser");
    expect(match).toBeDefined();
    expect(match?.achieved).not.toBeNull();
    expect(match?.achieved?.userId).toBe("defUser1");
  });

  test("getAchievementDefinitionsByUserId missing userId returns error", async () => {
    const result = await handleJsonMessage(repo, {
      action: "getAchievementDefinitionsByUserId",
      payload: {},
    });
    expect(result.ok).toBe(false);
  });

  test("updateAchievement updates and returns achievement", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "UpdA",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "i.png",
        typeId: "t_TL",
      },
    });
    expect(create.ok).toBe(true);
    const achId = (
      create as unknown as { ok: true; achievement: { id: string } }
    ).achievement.id;

    const result = await handleJsonMessage(repo, {
      action: "updateAchievement",
      payload: {
        achievementId: achId,
        title: "UpdNew",
        description: "ND",
        goal: 99,
        reward: 50,
        label: "NL",
        public: true,
        active: false,
        secret: true,
        image: "n.png",
        typeId: "t_NTL",
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.achievement?.title).toBe("UpdNew");
      expect(result.achievement?.goal).toBe(99);
      expect(result.achievement?.typeAchievement.label).toBe("NTL");
    }
  });

  test("updateAchievement returns error when not found", async () => {
    const result = await handleJsonMessage(repo, {
      action: "updateAchievement",
      payload: {
        achievementId: "nonexistent",
        title: "T",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "i.png",
        typeId: "t_TL",
      },
    });
    expect(result.ok).toBe(false);
  });

  test("updateAchievement returns error when achievementId missing", async () => {
    const result = await handleJsonMessage(repo, {
      action: "updateAchievement",
      payload: {
        title: "T",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "i.png",
        typeId: "t_TL",
      },
    });
    expect(result.ok).toBe(false);
  });

  test("deleteAchievement deletes and returns achievement", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createAchievement",
      payload: {
        title: "DelHdl",
        description: "D",
        goal: 1,
        reward: 1,
        label: "L",
        public: false,
        active: true,
        secret: false,
        image: "i.png",
        typeId: "t_TL",
      },
    });
    expect(create.ok).toBe(true);
    const achId = (
      create as unknown as { ok: true; achievement: { id: string } }
    ).achievement.id;

    const result = await handleJsonMessage(repo, {
      action: "deleteAchievement",
      payload: { achievementId: achId },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.achievement?.id).toBe(achId);
    }
  });

  test("deleteAchievement returns error when not found", async () => {
    const result = await handleJsonMessage(repo, {
      action: "deleteAchievement",
      payload: { achievementId: "nonexistent" },
    });
    expect(result.ok).toBe(false);
  });

  test("deleteAchievement returns error when achievementId missing", async () => {
    const result = await handleJsonMessage(repo, {
      action: "deleteAchievement",
      payload: {},
    });
    expect(result.ok).toBe(false);
  });

  test("badge create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createBadge",
      payload: { title: "B", img: "i", channelId: "ch-badge-cg" },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getBadge",
      payload: { badgeId: "b_B" },
    });
    expect(get.ok).toBe(true);
  });

  test("achieved create/get", async () => {
    const payload = {
      achievementId: "a1",
      userId: "u1",
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: "2023-01-01T00:00:00Z",
    };

    const create = await handleJsonMessage(repo, {
      action: "createAchieved",
      payload,
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getAchieved",
      payload: { achievementId: "a1", userId: "u1" },
    });
    expect(get.ok).toBe(true);
  });

  test("are create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u1", channelId: "c1", userType: "admin" },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getAre",
      payload: { userId: "u1", channelId: "c1" },
    });
    expect(get.ok).toBe(true);
  });

  test("getAreByUserId returns records for user", async () => {
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u2", channelId: "c1", userType: "mod" },
    });
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u2", channelId: "c2", userType: "viewer" },
    });
    const result = await handleJsonMessage(repo, {
      action: "getAreByUserId",
      payload: { userId: "u2" },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.records).toHaveLength(2);
  });

  test("getAreByUserId returns missing when userId not provided", async () => {
    const result = await handleJsonMessage(repo, {
      action: "getAreByUserId",
      payload: {},
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("missing");
  });

  test("getAreByChannelId returns records for channel", async () => {
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u3", channelId: "c3", userType: "mod" },
    });
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u4", channelId: "c3", userType: "viewer" },
    });
    const result = await handleJsonMessage(repo, {
      action: "getAreByChannelId",
      payload: { channelId: "c3" },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.records).toHaveLength(2);
  });

  test("getAreByChannelId returns missing when channelId not provided", async () => {
    const result = await handleJsonMessage(repo, {
      action: "getAreByChannelId",
      payload: {},
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("missing");
  });

  test("updateAre updates userType", async () => {
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u5", channelId: "c5", userType: "viewer" },
    });
    const result = await handleJsonMessage(repo, {
      action: "updateAre",
      payload: { userId: "u5", channelId: "c5", userType: "admin" },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.are?.userType).toBe("admin");
  });

  test("updateAre returns error when not found", async () => {
    const result = await handleJsonMessage(repo, {
      action: "updateAre",
      payload: { userId: "none", channelId: "none", userType: "admin" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("not found");
  });

  test("updateAre returns missing when userId/channelId not provided", async () => {
    const result = await handleJsonMessage(repo, {
      action: "updateAre",
      payload: { userType: "admin" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("missing");
  });

  test("deleteAre deletes record", async () => {
    await handleJsonMessage(repo, {
      action: "createAre",
      payload: { userId: "u6", channelId: "c6", userType: "viewer" },
    });
    const result = await handleJsonMessage(repo, {
      action: "deleteAre",
      payload: { userId: "u6", channelId: "c6" },
    });
    expect(result.ok).toBe(true);
  });

  test("deleteAre returns error when not found", async () => {
    const result = await handleJsonMessage(repo, {
      action: "deleteAre",
      payload: { userId: "none", channelId: "none" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("not found");
  });

  test("deleteAre returns missing when userId/channelId not provided", async () => {
    const result = await handleJsonMessage(repo, {
      action: "deleteAre",
      payload: {},
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("missing");
  });

  test("possesses create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createPossesses",
      payload: {
        userId: "u1",
        badgeId: "b1",
        acquiredDate: "2023-01-01T00:00:00Z",
      },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getPossesses",
      payload: { userId: "u1", badgeId: "b1" },
    });
    expect(get.ok).toBe(true);
  });

  test("possesses create returns error when already exists", async () => {
    await handleJsonMessage(repo, {
      action: "createPossesses",
      payload: {
        userId: "u_dup",
        badgeId: "b_dup",
        acquiredDate: "2023-01-01T00:00:00Z",
      },
    });
    const dup = await handleJsonMessage(repo, {
      action: "createPossesses",
      payload: {
        userId: "u_dup",
        badgeId: "b_dup",
        acquiredDate: "2023-06-01T00:00:00Z",
      },
    });
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.error).toBe("already exists");
  });

  test("unknown action", async () => {
    const res = await handleJsonMessage(repo, {
      action: "nope",
      payload: {},
    });
    expect(res.ok).toBe(false);
  });

  test("validation errors", async () => {
    const actions = [
      "createUser",
      "getUser",
      "createChannel",
      "getChannel",
      "updateChannel",
      "getBadgeByChannelId",
      "createTypeAchievement",
      "getTypeAchievement",
      "createAchievement",
      "getAchievement",
      "activateAchievement",
      "deactivateAchievement",
      "createBadge",
      "getBadge",
      "createAchieved",
      "getAchieved",
      "createAre",
      "getAre",
      "getAreByUserId",
      "getAreByChannelId",
      "updateAre",
      "deleteAre",
      "createPossesses",
      "getPossesses",
    ];

    for (const action of actions) {
      const res = await handleJsonMessage(repo, { action, payload: {} });
      expect(res.ok).toBe(false);
    }
  });

  test("repo throws error", async () => {
    const throwingRepo = makeRepoMock();
    throwingRepo.user.addUser = async () => {
      throw new Error("fail");
    };

    const res = await handleJsonMessage(throwingRepo, {
      action: "createUser",
      payload: {
        username: "bob",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });

    expect(res.ok).toBe(false);
  });

  test("msg null returns unknown action", async () => {
    const repo = makeRepoMock();
    const res = await handleJsonMessage(repo, null);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("unknown action");
  });

  test("msg undefined returns unknown action", async () => {
    const repo = makeRepoMock();
    const res = await handleJsonMessage(repo, undefined);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("unknown action");
  });

  test("handler throws non-Error returns error message", async () => {
    const repo = makeRepoMock();
    repo.user.addUser = async () => {
      throw "string error";
    };
    const res = await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "y",
        username: "x",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("string error");
  });

  test("getAllUsers returns list of users", async () => {
    const repo = makeRepoMock();
    await repo.user.addUser({
      id: "u1",
      username: "alice",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await repo.user.addUser({
      id: "u2",
      username: "bob",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const res = await handleJsonMessage(repo, {
      action: "getAllUsers",
      payload: {},
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.users).toHaveLength(2);
  });

  test("updateUser updates existing user", async () => {
    const repo = makeRepoMock();
    await repo.user.addUser({
      id: "u1",
      username: "old",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { userId: "u1", username: "new" },
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.user?.username).toBe("new");
  });

  test("updateUser updates profileImageUrl", async () => {
    const repo = makeRepoMock();
    await repo.user.addUser({
      id: "u1",
      username: "alice",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { userId: "u1", profileImageUrl: "http://img.com/a.png" },
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.user?.profileImageUrl).toBe("http://img.com/a.png");
  });

  test("updateUser updates channelDescription", async () => {
    const repo = makeRepoMock();
    await repo.user.addUser({
      id: "u1",
      username: "alice",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { userId: "u1", channelDescription: "My channel" },
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.user?.channelDescription).toBe("My channel");
  });

  test("updateUser updates scope", async () => {
    const repo = makeRepoMock();
    await repo.user.addUser({
      id: "u1",
      username: "alice",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { userId: "u1", scope: "read:user" },
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.user?.scope).toBe("read:user");
  });

  test("updateUser updates lastUpdateTimestamp", async () => {
    const repo = makeRepoMock();
    await repo.user.addUser({
      id: "u1",
      username: "alice",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: {
        userId: "u1",
        lastUpdateTimestamp: "2024-06-15T12:30:00.000Z",
      },
    });
    expect(res.ok).toBe(true);
    if (res.ok)
      expect(res.user?.lastUpdateTimestamp).toBe("2024-06-15T12:30:00.000Z");
  });

  test("updateUser returns error when user not found", async () => {
    const repo = makeRepoMock();
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { userId: "nonexistent", username: "test" },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("user not found");
  });

  test("updateUser returns missing when userId not provided", async () => {
    const repo = makeRepoMock();
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { username: "test" },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("missing");
  });

  test("createUser returns error when xp is negative", async () => {
    const repo = makeRepoMock();
    const res = await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_neg_xp",
        username: "negxp",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
        xp: -1,
      },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("xp must be a non-negative number");
  });

  test("updateUser returns error when xp is negative", async () => {
    const repo = makeRepoMock();
    await handleJsonMessage(repo, {
      action: "createUser",
      payload: {
        id: "twitch_up_neg",
        username: "upneg",
        lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
      },
    });
    const res = await handleJsonMessage(repo, {
      action: "updateUser",
      payload: { userId: "twitch_up_neg", xp: -5 },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe("xp must be a non-negative number");
  });
});
