// src/handlers/jsonHandler.ts
import { insertUser, getUserById, User } from "../userRepository";

/**
 * Expects payload like:
 * { action: "createUser", payload: { User_ID: "...", User_Username: "..." } }
 */
export async function handleJsonMessage(msg: any) {
  if (!msg || !msg.action) {
    throw new Error("Invalid message");
  }

  switch (msg.action) {
    case "createUser": {
      const u: User = msg.payload;
      if (!u?.User_ID || !u?.User_Username)
        throw new Error("Missing user fields");
      await insertUser(u);
      return { ok: true };
    }
    case "getUser": {
      const id = msg.payload?.User_ID;
      if (!id) throw new Error("Missing User_ID");
      const user = await getUserById(id);
      return { ok: true, user };
    }
    default:
      throw new Error("Unknown action");
  }
}
