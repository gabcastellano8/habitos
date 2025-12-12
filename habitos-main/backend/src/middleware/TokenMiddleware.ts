import { NextFunction, Request, Response } from "express";
import { LoginService } from "../service/LoginService";

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; email: string };
    }
  }
}

export class TokenMiddleware {
  private service = new LoginService();

  verificarAcesso = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Nenhum token informado!" });
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ error: "Token mal formatado!" });
    }

    try {
      const payload = await this.service.validarToken(token);
      req.usuario = { id: payload.usuarioId, email: payload.usuarioEmail };
      next();
    } catch (err: any) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}
