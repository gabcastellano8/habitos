import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entity/Usuario";
import { Habito } from "./entity/Habito";
import { RegistroHabito } from "./entity/RegistroHabito";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "yHpcKUdz*U7v$e?",
  database: process.env.DB_NAME || "api_habitos",
  synchronize: true,
  logging: false,
  entities: [Usuario, Habito, RegistroHabito],
});
