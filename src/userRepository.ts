import { pool } from "./index";

export type User = {
  User_ID: string;
  User_Username: string;
};

export async function insertUser(user: User): Promise<void> {
  const sql = `INSERT INTO Users (User_ID, User_Username) VALUES (?, ?) 
               ON DUPLICATE KEY UPDATE User_Username = VALUES(User_Username)`;
  const conn = await pool.getConnection();
  try {
    await conn.execute(sql, [user.User_ID, user.User_Username]);
  } finally {
    conn.release();
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const sql = `SELECT User_ID, User_Username FROM Users WHERE User_ID = ? LIMIT 1`;
  const [rows] = await pool.execute(sql, [id]);
  const rs = rows as any[];
  if (rs.length === 0) return null;
  //disabled camelcase because DB name is case sensitive
  // eslint-disable-next-line camelcase
  return { User_ID: rs[0].User_ID, User_Username: rs[0].User_Username };
}
