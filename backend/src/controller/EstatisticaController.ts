import { Request, Response } from "express";
import { EstatisticaService } from "../service/EstatisticaService";

export class EstatisticaController {
  private service = new EstatisticaService();

  /**
   * Retorna um JSON aninhado com todos os hábitos
   * e seus agendamentos filtrados por data.
   */
  dadosCompletos = async (req: Request, res: Response) => {
    const usuarioId = req.usuario.id;
    const { inicio, fim } = req.query;

    try {
      const dados = await this.service.buscarDadosCompletos(
        usuarioId,
        inicio as string | undefined,
        fim as string | undefined
      );
      res.json(dados);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };
}