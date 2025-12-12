import { Repository } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";

export class UsuarioService {
  private repo: Repository<Usuario>;

  constructor() {
    this.repo = AppDataSource.getRepository(Usuario);
  }

  /**
   * Cria um novo usuário no banco de dados.
   * Inclui validação, verificação de duplicidade e hashing de senha.
   */
  async inserir(usuario: Partial<Usuario>) {
    const { email, senha } = usuario;

    // --- Início das Validações (AC 3 e AC 4) ---

    // 1. Validação de campos obrigatórios
    if (!email || !senha) {
      throw { id: 400, msg: "E-mail e senha são obrigatórios" };
    }

    // 2. Validação de regra de negócio (Senha)
    if (senha.length < 6) {
      throw { id: 400, msg: "A senha deve ter no mínimo 6 caracteres" };
    }

    // 3. Verificação de duplicidade (E-mail)
    const emailExiste = await this.repo.findOneBy({ email });
    if (emailExiste) {
      throw { id: 409, msg: "Este e-mail já está em uso" };
    }

    // --- Fim das Validações ---

    // 4. Hashing da senha (Segurança - AC 3)
    const hashSenha = await bcrypt.hash(senha, 10);

    // 5. Criação e salvamento da entidade
    const novo = this.repo.create({
      email,
      senha: hashSenha,
    });

    const usuarioSalvo = await this.repo.save(novo);

    // 6. Remove a senha do objeto retornado (FORMA CORRETA)
    // Usamos desestruturação para 'tirar' a senha do objeto
    // e retornamos apenas o 'resto' (usuarioSemSenha).
    const { senha: _, ...usuarioSemSenha } = usuarioSalvo;

    return usuarioSemSenha;
  }

  /**
   * Lista todos os usuários.
   */
  async listar() {
    // Usando 'select' para evitar vazar os hashes das senhas
    return await this.repo.find({
      select: ["id", "email"], // Seleciona apenas id e email
    });
  }
}