import { Repository } from "typeorm";
import { Habito } from "../entity/Habito";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";
import { RegistroHabito } from "../entity/RegistroHabito";

interface CriarHabitoBody {
  nome: string;
  descricao?: string;
  datas: string[]; 
}

export class HabitoService {
  private repo: Repository<Habito>;
  private registroRepo: Repository<RegistroHabito>; 

  constructor() {
    this.repo = AppDataSource.getRepository(Habito);
    this.registroRepo = AppDataSource.getRepository(RegistroHabito);
  }

  async inserir(habitoBody: CriarHabitoBody, usuarioId: number) {
    const { nome, descricao, datas } = habitoBody;

    if (!nome || !datas || datas.length === 0) {
      throw { id: 400, msg: "Nome e pelo menos uma data são obrigatórios" };
    }

    const novoHabito = this.repo.create({
      nome,
      descricao,
      usuario: { id: usuarioId } as Usuario,
    });
    const habitoSalvo = await this.repo.save(novoHabito);

    const novosRegistros: RegistroHabito[] = [];
    for (const data of datas) {
      const novoRegistro = this.registroRepo.create({
        data,
        status: "pendente", 
        habito: habitoSalvo,
        usuario: { id: usuarioId } as Usuario,
      });
      novosRegistros.push(novoRegistro);
    }
    await this.registroRepo.save(novosRegistros); 

    return habitoSalvo; 
  }

  async listarPorUsuario(usuarioId: number) {
    return await this.repo.find({ where: { usuario: { id: usuarioId } }, order: { nome: "ASC" } });
  }

  async buscarPorId(id: number, usuarioId: number) {
    const hab = await this.repo.findOne({ where: { id, usuario: { id: usuarioId } } });
    if (!hab) throw { id: 404, msg: "Hábito não encontrado" };
    return hab;
  }

  async atualizar(id: number, habito: Partial<Habito>, usuarioId: number) {
    const existente = await this.buscarPorId(id, usuarioId);
    existente.nome = habito.nome ?? existente.nome;
    existente.descricao = habito.descricao ?? existente.descricao;
    return await this.repo.save(existente);
  }

  async deletar(id: number, usuarioId: number) {
    const existente = await this.buscarPorId(id, usuarioId);
    await this.repo.remove(existente);
    return existente;
  }
}