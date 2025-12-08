import { handleJsonMessage, GatewayRepo } from "../../handler/jsonHandler";
import type {
  userDTO,
  channelDTO,
  typeAchievementDTO,
  achievementDTO,
  badgeDTO,
  achievedDTO,
  areDTO,
  possessesDTO,
} from "../../database/database";

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
      addUser: async (username: string) => {
        const u = { id: "u_" + username, username };
        users.push(u);
        return u;
      },
      getUserById: async (id: string) => users.find((u) => u.id === id) ?? null,
    },
    channel: {
      addChannel: async (name: string) => {
        const c = { id: "c_" + name, name };
        channels.push(c);
        return c;
      },
      getChannelById: async (id: string) =>
        channels.find((c) => c.id === id) ?? null,
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
      payload: { username: "bob" },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getUser",
      payload: { userId: "u_bob" },
    });
    expect(get.ok).toBe(true);
  });

  test("channel create/get", async () => {
    const create = await handleJsonMessage(repo, {
      action: "createChannel",
      payload: { name: "chan1" },
    });
    expect(create.ok).toBe(true);

    const get = await handleJsonMessage(repo, {
      action: "getChannel",
      payload: { channelId: "c_chan1" },
    });
    expect(get.ok).toBe(true);
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
      payload: { username: "bob" },
    });

    expect(res.ok).toBe(false);
  });
});
