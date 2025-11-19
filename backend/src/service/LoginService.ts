import { Repository } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET ?? "segredo_dev";

export class LoginService {
  private repo: Repository<Usuario>;
  constructor() {
    this.repo = AppDataSource.getRepository(Usuario);
  }

  async verificarLogin(email: string, senha: string) {
    const usuario = await this.repo.findOneBy({ email });
    if (!usuario) throw { id: 401, msg: "Usuario ou senha invalidos" };

    const valid = await bcrypt.compare(senha, usuario.senha);
    if (!valid) throw { id: 401, msg: "Usuario ou senha invalidos" };

    const token = jwt.sign({ usuarioId: usuario.id, usuarioEmail: usuario.email }, SECRET, { expiresIn: "8h" });
    return { token, usuario: { id: usuario.id, email: usuario.email } };
  }

  async validarToken(token: string) {
    try {
      const payload = jwt.verify(token, SECRET) as any;
      return payload;
    } catch (err) {
      throw { id: 401, msg: "Token Invalido" };
    }
  }
}
