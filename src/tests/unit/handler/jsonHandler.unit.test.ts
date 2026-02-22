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
  const badges: badgeDTO[] = [];
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
      }) => {
        const u: userDTO = {
          id: user.id,
          username: user.username,
          lastUpdateTimestamp: user.lastUpdateTimestamp,
          profileImageUrl: user.profileImageUrl ?? null,
          channelDescription: user.channelDescription ?? null,
          scope: user.scope ?? null,
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
      addChannel: async (id: string, name: string) => {
        const c = { id, name };
        channels.push(c);
        return c;
      },
      getChannelById: async (id: string) =>
        channels.find((c) => c.id === id) ?? null,
      updateChannel: async (id: string, data: { name?: string }) => {
        const channel = channels.find((c) => c.id === id);
        if (!channel) return null;
        if (data.name !== undefined) channel.name = data.name;
        return channel;
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
        const ach = { id: "a_" + a.title, ...a };
        achievements.push(ach);
        return ach;
      },
      getAchievementById: async (id: string) =>
        achievements.find((a) => a.id === id) ?? null,
    },
    badge: {
      addBadge: async (title: string, img: string) => {
        const b = { id: "b_" + title, title, img };
        badges.push(b);
        return b;
      },
      getBadgeById: async (id: string) =>
        badges.find((b) => b.id === id) ?? null,
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

  beforeEach(() => {
    repo = makeRepoMock();
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
      payload: { title: "testbadge", img: "badge.png" },
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
    expect(result.achievements).toHaveLength(1);
    expect(result.achievements![0].achievementId).toBe("a1");
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
      payload: { title: "rarebadge", img: "rare.png" },
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
      },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getAchievement",
      payload: { achievementId: "a_T" },
    });
    expect(get.ok).toBe(true);
  });

  test("badge create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createBadge",
      payload: { title: "B", img: "i" },
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
      "createTypeAchievement",
      "getTypeAchievement",
      "createAchievement",
      "getAchievement",
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
});
