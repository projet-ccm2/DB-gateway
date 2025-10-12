import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const {
  DATABASE_HOST = process.env.DATABASE_HOST || "localhost",
  DATABASE_PORT = process.env.DATABASE_PORT || "3306",
  DATABASE_USER = process.env.DATABASE_USER || "root",
  DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "",
  DATABASE_NAME = process.env.DATABASE_NAME ||
    process.env.MYSQL_DATABASE ||
    "mydb_test",
} = process.env;

export const pool = mysql.createPool({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
