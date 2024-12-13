import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const db = process.env.POSTGRES_DB || "";
export const password = process.env.POSTGRES_PASSWORD || "";
export const host = process.env.POSTGRES_HOST || "";
export const user = process.env.POSTGRES_USER || "";
export const secretKey = process.env.SECRET_TOKEN || "";

export const database = new Sequelize({
  username: user,
  password: password,
  database: db,
  host: host,
  dialect: "postgres",
});

export const sequelize = new Sequelize(db, user, password, {
  host: host,
  dialect: "postgres",
});
