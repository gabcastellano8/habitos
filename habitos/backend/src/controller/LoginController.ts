import { Request, Response } from "express";
import { LoginService } from "../service/LoginService";

export class LoginController {
  private service = new LoginService();

  realizarLogin = async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    try {
      const result = await this.service.verificarLogin(email, senha);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };
}
