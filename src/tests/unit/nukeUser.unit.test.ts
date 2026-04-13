/**
 * Comprehensive unit tests for the GDPR "nuke user" feature.
 *
 * DELETE /users/:id/all-data
 *
 * Verifies that ALL data related to a user is deleted:
 *  1. User's own achieved records
 *  2. User's own possesses records
 *  3. User's own are (channel-membership) records
 *  4. Other users' achieved on the user's channel achievements
 *  5. Other users' possesses for the user's channel badge
 *  6. Other users' are records for the user's channel
 *  7. Achievements linked to the user's channel
 *  8. Badge linked to the user's channel
 *  9. The user's channel
 * 10. The user record
 *
 * AND verifies that data belonging to OTHER users is NOT affected.
 */
import { MockDatabase } from "../mocks";
import { UserRepository } from "../../repositories/userRepository";

async function seedFullUser(
  db: MockDatabase,
  userId: string,
  otherUserId?: string,
) {
  // Create users
  const user = await db.addUser({
    id: userId,
    username: `user-${userId}`,
    lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
  });

  // Create channel (channelId = userId convention)
  const channel = await db.addChannel({ id: userId, name: `ch-${userId}` });

  // Create type achievement (shared, should NOT be deleted)
  const type = await db.addTypeAchievement({
    label: "TypeA",
    data: "type-data",
  });

  // Create achievements on user's channel
  const ach1 = await db.addAchievement({
    title: "Ach1",
    description: "desc",
    goal: 10,
    reward: 5,
    label: "lab",
    public: true,
    active: true,
    secret: false,
    image: "img.png",
    channelId: userId,
    typeId: type.id,
  });

  const ach2 = await db.addAchievement({
    title: "Ach2",
    description: "desc2",
    goal: 20,
    reward: 10,
    label: "lab2",
    public: false,
    active: true,
    secret: false,
    image: "img2.png",
    channelId: userId,
    typeId: type.id,
  });

  // Create badge on user's channel
  const badge = (await db.addBadge({
    title: "UserBadge",
    img: "badge.png",
    channelId: userId,
  }))!;

  // User's own achieved records (on some achievement)
  const achieved = await db.addAchieved({
    achievementId: ach1!.id,
    userId,
    count: 5,
    finished: false,
    labelActive: true,
    acquiredDate: "2024-06-01T00:00:00.000Z",
  });

  // User's own possesses
  const possesses = await db.addPossesses({
    userId,
    badgeId: badge.id,
    acquiredDate: "2024-06-01T00:00:00.000Z",
  });

  // User's own are (membership in own channel)
  const are = await db.addAre({
    userId,
    channelId: userId,
    userType: "owner",
  });

  // If another user is provided, seed their data linked to user's channel
  let otherData = null;
  if (otherUserId) {
    const otherUser = await db.addUser({
      id: otherUserId,
      username: `user-${otherUserId}`,
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    // Other user's achieved on target user's channel achievement
    const otherAchieved = await db.addAchieved({
      achievementId: ach1!.id,
      userId: otherUserId,
      count: 3,
      finished: true,
      labelActive: false,
      acquiredDate: "2024-07-01T00:00:00.000Z",
    });

    // Other user possesses target user's channel badge
    const otherPossesses = await db.addPossesses({
      userId: otherUserId,
      badgeId: badge.id,
      acquiredDate: "2024-07-01T00:00:00.000Z",
    });

    // Other user is member of target user's channel
    const otherAre = await db.addAre({
      userId: otherUserId,
      channelId: userId,
      userType: "subscriber",
    });

    otherData = { otherUser, otherAchieved, otherPossesses, otherAre };
  }

  return {
    user,
    channel,
    type,
    ach1: ach1!,
    ach2: ach2!,
    badge,
    achieved,
    possesses,
    are,
    otherData,
  };
}

describe("nukeUser – MockDatabase (unit)", () => {
  it("returns false when user does not exist", async () => {
    const db = new MockDatabase();
    const result = await db.nukeUser("nonexistent");
    expect(result).toBe(false);
  });

  it("returns true and deletes the user", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target");
    const result = await db.nukeUser("target");
    expect(result).toBe(true);
    expect(await db.getUserById("target")).toBeNull();
  });

  it("deletes user's own achieved records", async () => {
    const db = new MockDatabase();
    const { ach1 } = await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getAchieved(ach1.id, "target")).toBeNull();
  });

  it("deletes user's own possesses records", async () => {
    const db = new MockDatabase();
    const { badge } = await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getPossesses("target", badge.id)).toBeNull();
  });

  it("deletes user's own are records", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getAre("target", "target")).toBeNull();
  });

  it("deletes user's channel", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getChannelById("target")).toBeNull();
  });

  it("deletes achievements linked to user's channel", async () => {
    const db = new MockDatabase();
    const { ach1, ach2 } = await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getAchievementById(ach1.id)).toBeNull();
    expect(await db.getAchievementById(ach2.id)).toBeNull();
  });

  it("deletes badge linked to user's channel", async () => {
    const db = new MockDatabase();
    const { badge } = await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getBadgeById(badge.id)).toBeNull();
  });

  it("deletes other users' achieved on user's channel achievements", async () => {
    const db = new MockDatabase();
    const { ach1 } = await seedFullUser(db, "target", "other");
    await db.nukeUser("target");
    // Other user's achieved on target's achievement should be gone
    expect(await db.getAchieved(ach1.id, "other")).toBeNull();
  });

  it("deletes other users' possesses for the channel badge", async () => {
    const db = new MockDatabase();
    const { badge } = await seedFullUser(db, "target", "other");
    await db.nukeUser("target");
    // Other user's possesses of target's badge should be gone
    expect(await db.getPossesses("other", badge.id)).toBeNull();
  });

  it("deletes other users' are records for user's channel", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target", "other");
    await db.nukeUser("target");
    expect(await db.getAre("other", "target")).toBeNull();
  });

  it("does NOT delete other user's own record", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target", "other");
    await db.nukeUser("target");
    // Other user should still exist
    expect(await db.getUserById("other")).not.toBeNull();
  });

  it("does NOT delete other user's own are in different channels", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target", "other");
    // Other user also in a separate channel
    await db.addChannel({ id: "separate-ch", name: "SeparateCh" });
    await db.addAre({
      userId: "other",
      channelId: "separate-ch",
      userType: "subscriber",
    });
    await db.nukeUser("target");
    expect(await db.getAre("other", "separate-ch")).not.toBeNull();
  });

  it("does NOT delete other user's own possesses for different badges", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target", "other");
    // Other user possesses a badge from a different channel
    await db.addChannel({ id: "other-ch", name: "OtherCh" });
    const otherBadge = (await db.addBadge({
      title: "OtherBadge",
      img: "other.png",
      channelId: "other-ch",
    }))!;
    await db.addPossesses({
      userId: "other",
      badgeId: otherBadge.id,
      acquiredDate: "2024-08-01T00:00:00.000Z",
    });
    await db.nukeUser("target");
    expect(await db.getPossesses("other", otherBadge.id)).not.toBeNull();
  });

  it("does NOT delete other user's own achieved on different achievements", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target", "other");
    // Other user has achieved on a totally separate achievement
    const type = await db.addTypeAchievement({
      label: "OtherType",
      data: "odata",
    });
    await db.addChannel({ id: "other-ch2", name: "OtherCh2" });
    const otherAch = await db.addAchievement({
      title: "OtherAch",
      description: "od",
      goal: 1,
      reward: 1,
      label: "ol",
      public: true,
      active: true,
      secret: false,
      image: "oi.png",
      channelId: "other-ch2",
      typeId: type.id,
    });
    await db.addAchieved({
      achievementId: otherAch!.id,
      userId: "other",
      count: 1,
      finished: true,
      labelActive: true,
      acquiredDate: "2024-08-01T00:00:00.000Z",
    });
    await db.nukeUser("target");
    expect(await db.getAchieved(otherAch!.id, "other")).not.toBeNull();
  });

  it("does NOT delete type achievements (shared resource)", async () => {
    const db = new MockDatabase();
    const { type } = await seedFullUser(db, "target");
    await db.nukeUser("target");
    expect(await db.getTypeAchievementById(type.id)).not.toBeNull();
  });

  it("handles user with no channel gracefully", async () => {
    const db = new MockDatabase();
    await db.addUser({
      id: "no-channel-user",
      username: "nch",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    const result = await db.nukeUser("no-channel-user");
    expect(result).toBe(true);
    expect(await db.getUserById("no-channel-user")).toBeNull();
  });

  it("handles user with channel but no achievements or badge", async () => {
    const db = new MockDatabase();
    await db.addUser({
      id: "empty-ch-user",
      username: "ech",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await db.addChannel({ id: "empty-ch-user", name: "EmptyCh" });
    const result = await db.nukeUser("empty-ch-user");
    expect(result).toBe(true);
    expect(await db.getUserById("empty-ch-user")).toBeNull();
    expect(await db.getChannelById("empty-ch-user")).toBeNull();
  });

  it("deletes user membership in OTHER channels too", async () => {
    const db = new MockDatabase();
    await db.addUser({
      id: "multi-ch",
      username: "mc",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await db.addChannel({ id: "ch-A", name: "A" });
    await db.addChannel({ id: "ch-B", name: "B" });
    await db.addAre({ userId: "multi-ch", channelId: "ch-A", userType: "sub" });
    await db.addAre({ userId: "multi-ch", channelId: "ch-B", userType: "mod" });
    await db.nukeUser("multi-ch");
    // User's memberships in those channels should be gone
    expect(await db.getAre("multi-ch", "ch-A")).toBeNull();
    expect(await db.getAre("multi-ch", "ch-B")).toBeNull();
    // But the channels themselves should remain
    expect(await db.getChannelById("ch-A")).not.toBeNull();
    expect(await db.getChannelById("ch-B")).not.toBeNull();
  });

  it("second nuke returns false (idempotent)", async () => {
    const db = new MockDatabase();
    await seedFullUser(db, "target");
    expect(await db.nukeUser("target")).toBe(true);
    expect(await db.nukeUser("target")).toBe(false);
  });

  it("cleans linked data for MULTIPLE other users on the target's channel", async () => {
    const db = new MockDatabase();
    const { ach1, badge } = await seedFullUser(db, "target", "other1");

    // Add a third user also linked to target's channel
    await db.addUser({
      id: "other2",
      username: "user-other2",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await db.addAchieved({
      achievementId: ach1.id,
      userId: "other2",
      count: 7,
      finished: true,
      labelActive: false,
      acquiredDate: "2024-09-01T00:00:00.000Z",
    });
    await db.addPossesses({
      userId: "other2",
      badgeId: badge.id,
      acquiredDate: "2024-09-01T00:00:00.000Z",
    });
    await db.addAre({
      userId: "other2",
      channelId: "target",
      userType: "viewer",
    });

    await db.nukeUser("target");

    // Both other users' linked data on target's channel should be gone
    expect(await db.getAchieved(ach1.id, "other1")).toBeNull();
    expect(await db.getAchieved(ach1.id, "other2")).toBeNull();
    expect(await db.getPossesses("other1", badge.id)).toBeNull();
    expect(await db.getPossesses("other2", badge.id)).toBeNull();
    expect(await db.getAre("other1", "target")).toBeNull();
    expect(await db.getAre("other2", "target")).toBeNull();

    // Both other users themselves survive
    expect(await db.getUserById("other1")).not.toBeNull();
    expect(await db.getUserById("other2")).not.toBeNull();
  });

  it("deletes user with no channel but having are/achieved/possesses in other channels", async () => {
    const db = new MockDatabase();

    // Create user without a channel
    await db.addUser({
      id: "nomad",
      username: "nomad",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    // Another user owns a channel with achievements/badge
    await db.addUser({
      id: "owner",
      username: "owner",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await db.addChannel({ id: "owner", name: "ownerCh" });
    const type = await db.addTypeAchievement({ label: "T", data: "D" });
    const ach = await db.addAchievement({
      title: "OwnerAch",
      description: "d",
      goal: 1,
      reward: 1,
      label: "l",
      public: true,
      active: true,
      secret: false,
      image: "",
      channelId: "owner",
      typeId: type.id,
    });
    const badge = (await db.addBadge({
      title: "OwnerBadge",
      img: "b.png",
      channelId: "owner",
    }))!;

    // nomad participates in owner's channel
    await db.addAre({
      userId: "nomad",
      channelId: "owner",
      userType: "viewer",
    });
    await db.addAchieved({
      achievementId: ach!.id,
      userId: "nomad",
      count: 2,
      finished: true,
      labelActive: true,
      acquiredDate: "2024-06-01T00:00:00.000Z",
    });
    await db.addPossesses({
      userId: "nomad",
      badgeId: badge.id,
      acquiredDate: "2024-06-01T00:00:00.000Z",
    });

    expect(await db.nukeUser("nomad")).toBe(true);

    // nomad's records are gone
    expect(await db.getUserById("nomad")).toBeNull();
    expect(await db.getAre("nomad", "owner")).toBeNull();
    expect(await db.getAchieved(ach!.id, "nomad")).toBeNull();
    expect(await db.getPossesses("nomad", badge.id)).toBeNull();

    // owner's channel, achievement, badge all survive
    expect(await db.getChannelById("owner")).not.toBeNull();
    expect(await db.getAchievementById(ach!.id)).not.toBeNull();
    expect(await db.getBadgeById(badge.id)).not.toBeNull();
    expect(await db.getUserById("owner")).not.toBeNull();
  });

  it("deletes achievements that have zero achieved records", async () => {
    const db = new MockDatabase();
    await db.addUser({
      id: "target",
      username: "t",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    await db.addChannel({ id: "target", name: "tch" });
    const type = await db.addTypeAchievement({ label: "T", data: "D" });
    const ach = await db.addAchievement({
      title: "LonelyAch",
      description: "d",
      goal: 99,
      reward: 1,
      label: "l",
      public: true,
      active: true,
      secret: false,
      image: "",
      channelId: "target",
      typeId: type.id,
    });

    // Nobody has achieved this achievement — it should still be deleted
    await db.nukeUser("target");
    expect(await db.getAchievementById(ach!.id)).toBeNull();
  });

  it("deletes user's achieved/possesses spread across many other channels", async () => {
    const db = new MockDatabase();
    await db.addUser({
      id: "wanderer",
      username: "w",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });

    const type = await db.addTypeAchievement({ label: "T", data: "D" });
    const badges: string[] = [];
    const achIds: string[] = [];

    // Create 3 independent channels with achievements and badges
    for (const ch of ["chX", "chY", "chZ"]) {
      await db.addChannel({ id: ch, name: ch });
      const ach = await db.addAchievement({
        title: `Ach-${ch}`,
        description: "d",
        goal: 1,
        reward: 1,
        label: "l",
        public: true,
        active: true,
        secret: false,
        image: "",
        channelId: ch,
        typeId: type.id,
      });
      const badge = (await db.addBadge({
        title: `Badge-${ch}`,
        img: "b.png",
        channelId: ch,
      }))!;
      achIds.push(ach!.id);
      badges.push(badge.id);

      await db.addAre({
        userId: "wanderer",
        channelId: ch,
        userType: "viewer",
      });
      await db.addAchieved({
        achievementId: ach!.id,
        userId: "wanderer",
        count: 1,
        finished: false,
        labelActive: true,
        acquiredDate: "2024-06-01T00:00:00.000Z",
      });
      await db.addPossesses({
        userId: "wanderer",
        badgeId: badge.id,
        acquiredDate: "2024-06-01T00:00:00.000Z",
      });
    }

    await db.nukeUser("wanderer");

    // All memberships, achieved, possesses across all 3 channels must be gone
    for (const ch of ["chX", "chY", "chZ"]) {
      expect(await db.getAre("wanderer", ch)).toBeNull();
    }
    for (const id of achIds) {
      expect(await db.getAchieved(id, "wanderer")).toBeNull();
    }
    for (const id of badges) {
      expect(await db.getPossesses("wanderer", id)).toBeNull();
    }

    // The channels, achievements, and badges themselves survive
    for (const ch of ["chX", "chY", "chZ"]) {
      expect(await db.getChannelById(ch)).not.toBeNull();
    }
    for (const id of achIds) {
      expect(await db.getAchievementById(id)).not.toBeNull();
    }
    for (const id of badges) {
      expect(await db.getBadgeById(id)).not.toBeNull();
    }
  });
});

describe("nukeUser – UserRepository (unit)", () => {
  it("delegates to db.nukeUser and returns the result", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    await db.addUser({
      id: "repo-nuke",
      username: "rn",
      lastUpdateTimestamp: "2024-01-01T00:00:00.000Z",
    });
    expect(await repo.nukeUser("repo-nuke")).toBe(true);
    expect(await repo.getUserById("repo-nuke")).toBeNull();
  });

  it("returns false for non-existent user", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    expect(await repo.nukeUser("ghost")).toBe(false);
  });
});

describe("nukeUser – Controller (unit)", () => {
  const mockRes = () => {
    const res = {} as import("express").Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
  };

  it("returns 204 when user exists and is nuked", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const { createUsersController } = await import(
      "../../controllers/usersController"
    );
    const ctrl = createUsersController(repo);
    await seedFullUser(db, "ctrl-nuke", "ctrl-other");

    const req = {
      params: { id: "ctrl-nuke" },
    } as unknown as import("express").Request;
    const res = mockRes();
    await ctrl.nukeUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("returns 404 when user does not exist", async () => {
    const db = new MockDatabase();
    const repo = new UserRepository(db);
    const { createUsersController } = await import(
      "../../controllers/usersController"
    );
    const ctrl = createUsersController(repo);

    const req = {
      params: { id: "ghost" },
    } as unknown as import("express").Request;
    const res = mockRes();
    await ctrl.nukeUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "not found" });
  });

  it("returns 500 when repo throws", async () => {
    const throwingRepo = {
      nukeUser: jest.fn().mockRejectedValue(new Error("db")),
    } as unknown as UserRepository;
    const { createUsersController } = await import(
      "../../controllers/usersController"
    );
    const ctrl = createUsersController(throwingRepo);

    const req = { params: { id: "x" } } as unknown as import("express").Request;
    const res = mockRes();
    await ctrl.nukeUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("nukeUser – Route (unit)", () => {
  it("DELETE /:id/all-data returns 204 on success", async () => {
    const express = (await import("express")).default;
    const request = (await import("supertest")).default;
    const { createUsersRoutes } = await import("../../routes/usersRoutes");

    const db = new MockDatabase();
    await seedFullUser(db, "route-nuke");
    const app = express();
    app.use(express.json());
    app.use("/", createUsersRoutes(db));

    const res = await request(app).delete("/route-nuke/all-data");
    expect(res.status).toBe(204);
  });

  it("DELETE /:id/all-data returns 404 when user not found", async () => {
    const express = (await import("express")).default;
    const request = (await import("supertest")).default;
    const { createUsersRoutes } = await import("../../routes/usersRoutes");

    const db = new MockDatabase();
    const app = express();
    app.use(express.json());
    app.use("/", createUsersRoutes(db));

    const res = await request(app).delete("/ghost/all-data");
    expect(res.status).toBe(404);
  });
});
