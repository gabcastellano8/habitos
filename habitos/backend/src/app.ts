import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import router from "./routes";
import dotenv from "dotenv";
dotenv.config();

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api", router);

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}).catch((err) => console.error("Erro init data source:", err));
