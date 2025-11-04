import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DATABASE_HOST = "localhost",
  DATABASE_PORT = "3306",
  DATABASE_USER = "root",
  DATABASE_PASSWORD = "",
  DATABASE_NAME = "mydb",
  NODE_ENV = "development",
} = process.env;

console.log(
  `Starting app in ${NODE_ENV} mode, connecting to DB: ${DATABASE_NAME}`,
);

export const pool = mysql.createPool({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
