import { AppDataSource } from "../data-source";
import { Habito } from "../entity/Habito";

export class EstatisticaService {
  private habitoRepo = AppDataSource.getRepository(Habito);

  /**
   * Busca todos os hábitos de um usuário e aninha seus
   * agendamentos (registros) filtrados por um período.
   */
  async buscarDadosCompletos(usuarioId: number, inicio?: string, fim?: string) {
    // 1. Definir o período (Default: últimos 30 dias)
    let dataInicio: string;
    let dataFim: string;

    if (inicio && fim) {
      dataInicio = inicio;
      dataFim = fim;
    } else {
      // Se 'inicio' ou 'fim' não forem fornecidos, usa o default
      const hoje = new Date();
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(hoje.getDate() - 30);
      
      dataFim = hoje.toISOString().split('T')[0];
      dataInicio = trintaDiasAtras.toISOString().split('T')[0];
    }

    // 2. Construir a Query (QueryBuilder)
    // Usamos 'leftJoinAndSelect' para buscar os hábitos
    // e 'leftJoin' nos agendamentos (registros)
    // filtrando-os pela data NO PRÓPRIO JOIN.
    const dados = await this.habitoRepo.createQueryBuilder("habito")
      .leftJoinAndSelect("habito.registros", "registro",
          // Filtra os agendamentos pelo período
          "registro.data BETWEEN :dataInicio AND :dataFim",
          { dataInicio, dataFim }
      )
      .where("habito.usuarioId = :usuarioId", { usuarioId })
      .orderBy("habito.nome", "ASC")
      .addOrderBy("registro.data", "ASC")
      .getMany();

    // 3. Formatar a resposta para o JSON exato que o P.O. pediu
    const resultadoFormatado = dados.map(habito => ({
      id: habito.id,
      nome: habito.nome,
      descricao: habito.descricao,
      // Mapeia os registros aninhados (se existirem)
      agendamentos: habito.registros ? habito.registros.map(reg => ({
        data: reg.data,
        status: reg.status
      })) : [] // Retorna [] se não houver agendamentos no período
    }));

    return resultadoFormatado;
  }
}