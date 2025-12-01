import { mockDatabase } from "../../database/mockDatabase";
import { userRepository } from "../../repositories/userRepository";
import { chanelRepository } from "../../repositories/chanelRepository";
import { typeAchievementRepository } from "../../repositories/typeAchievementRepository";
import { achievementRepository } from "../../repositories/achievementRepository";
import { badgeRepository } from "../../repositories/badgeRepository";
import { achievedRepository } from "../../repositories/achievedRepository";
import { areRepository } from "../../repositories/areRepository";
import { possessesRepository } from "../../repositories/possessesRepository";

describe("repositories (unit, mock)", () => {
  const db = new mockDatabase();
  const userRepo = new userRepository(db);
  const chanelRepo = new chanelRepository(db);
  const typeRepo = new typeAchievementRepository(db);
  const achRepo = new achievementRepository(db);
  const badgeRepo = new badgeRepository(db);
  const achievedRepo = new achievedRepository(db);
  const areRepo = new areRepository(db);
  const possRepo = new possessesRepository(db);

  test("user chanel type achievement badge achieved are possesses add/get flow", async () => {
    const user = await userRepo.addUser("u1");
    expect(user).toHaveProperty("id");

    const ch = await chanelRepo.addChanel("c1");
    expect(ch).toHaveProperty("id");

    const t = await typeRepo.add("label1", "data1");
    expect(t).toHaveProperty("id");

    const a = await achRepo.add({
      title: "at",
      description: "d",
      goal: 10,
      reward: 5,
      label: "lab",
    });
    expect(a).toHaveProperty("id");

    const b = await badgeRepo.add("bt", "img.png");
    expect(b).toHaveProperty("id");

    const achv = await achievedRepo.add({
      achievementId: a.id,
      userId: user.id,
      count: 1,
      finished: false,
      labelActive: true,
      aquiredDate: new Date().toISOString(),
    });
    expect(achv.achievementId).toBe(a.id);

    const are = await areRepo.add(user.id, ch.id, "admin");
    expect(are.userId).toBe(user.id);

    const poss = await possRepo.add(user.id, b.id, new Date().toISOString());
    expect(poss.badgeId).toBe(b.id);

    // reads
    const gotUser = await userRepo.getUserById(user.id);
    expect(gotUser?.id).toBe(user.id);

    const gotCh = await chanelRepo.getChanelById(ch.id);
    expect(gotCh?.id).toBe(ch.id);

    const gotT = await typeRepo.getById(t.id);
    expect(gotT?.id).toBe(t.id);

    const gotA = await achRepo.getById(a.id);
    expect(gotA?.id).toBe(a.id);

    const gotB = await badgeRepo.getById(b.id);
    expect(gotB?.id).toBe(b.id);

    const gotAchv = await achievedRepo.get(a.id, user.id);
    expect(gotAchv?.achievementId).toBe(a.id);

    const gotAre = await areRepo.get(user.id, ch.id);
    expect(gotAre?.chanelId).toBe(ch.id);

    const gotPoss = await possRepo.get(user.id, b.id);
    expect(gotPoss?.badgeId).toBe(b.id);

    // negative / not found cases to exercise branches
    const missingId = "00000000-0000-0000-0000-000000000000";
    expect(await userRepo.getUserById(missingId)).toBeNull();
    expect(await chanelRepo.getChanelById(missingId)).toBeNull();
    expect(await typeRepo.getById(missingId)).toBeNull();
    expect(await achRepo.getById(missingId)).toBeNull();
    expect(await badgeRepo.getById(missingId)).toBeNull();
    expect(await achievedRepo.get(a.id, missingId)).toBeNull();
    expect(await areRepo.get(missingId, ch.id)).toBeNull();
    expect(await possRepo.get(missingId, b.id)).toBeNull();
  });
});
