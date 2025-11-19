import { Repository } from "typeorm";
import { RegistroHabito } from "../entity/RegistroHabito";
import { AppDataSource } from "../data-source";

export class RegistroHabitoService {
  private repo: Repository<RegistroHabito>;
  constructor() {
    this.repo = AppDataSource.getRepository(RegistroHabito);
  }

  async buscarRegistrosDoDia(usuarioId: number, data: string) {
    return await this.repo.find({
      where: { usuario: { id: usuarioId }, data },
      relations: { habito: true },
      order: { habito: { nome: "ASC" } }, 
    });
  }

  async mudarStatus(registroId: number, usuarioId: number, status: string) {
    if (!status) {
      throw { id: 400, msg: "O 'status' é obrigatório" };
    }

    const registro = await this.repo.findOne({ where: { id: registroId, usuario: { id: usuarioId } } });
    if (!registro) {
      throw { id: 404, msg: "Agendamento não encontrado ou não pertence a este usuário" };
    }

    registro.status = status;
    return await this.repo.save(registro);
  }

  async buscarHistoricoHabito(habitoId: number, usuarioId: number) {
    return await this.repo.find({ where: { habito: { id: habitoId }, usuario: { id: usuarioId } }, order: { data: "DESC" } });
  }
}