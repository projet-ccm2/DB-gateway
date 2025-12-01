import type { userDTO } from "../database/database";

type RepoShape = {
  addUser(name: string, email: string): Promise<userDTO>;
  getUserById(id: string): Promise<userDTO | null>;
};

export async function handleJsonMessage(repo: RepoShape, msg: any) {
  switch (msg.action) {
    case "createUser":
      await repo.addUser(msg.payload.name, msg.payload.email);
      return { ok: true };

    case "getUser":
      const user = await repo.getUserById(
        msg.payload.userId || msg.payload.User_ID,
      );
      return { ok: true, user };

    default:
      return { ok: false, error: "unknown action" };
  }
}
