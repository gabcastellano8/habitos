import { Request, Response } from "express";
import { UsuarioService } from "../service/UsuarioService";
import jwt from "jsonwebtoken"; // 1. Importe o 'jsonwebtoken'
import dotenv from "dotenv"; // Importe para usar o .env

dotenv.config(); // Carrega as variáveis de ambiente

// 2. Defina o segredo (o mesmo usado no LoginService)
const SECRET = process.env.JWT_SECRET ?? "segredo_dev";

export class UsuarioController {
  private service = new UsuarioService();

  inserir = async (req: Request, res: Response) => {
    try {
      // 3. O Service agora retorna o usuário salvo (ex: {id: 8, email: "..."})
      const novoUsuario = await this.service.inserir(req.body);

      // 4. Crie o Token (O passo que faltava - AC 5)
      const token = jwt.sign(
        { usuarioId: novoUsuario.id, usuarioEmail: novoUsuario.email },
        SECRET,
        { expiresIn: "8h" }
      );

      // 5. Retorne o "Contrato de API" que combinamos
      res.status(201).json({
        user: novoUsuario, // o objeto {id, email}
        token: token,      // o token gerado
      });
    } catch (err: any) {
      // O service já retorna os erros 400 e 409
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  listar = async (_req: Request, res: Response) => {
    const users = await this.service.listar();
    res.json(users);
  };
}