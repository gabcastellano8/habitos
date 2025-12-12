import { Request, Response } from "express";
import { RegistroHabitoService } from "../service/RegistroHabitoService";

export class RegistroHabitoController {
  private service = new RegistroHabitoService();

  // Renomeado de 'marcarStatus' para 'mudarStatus'
  mudarStatus = async (req: Request, res: Response) => {
    const registroId = Number(req.params.id);
    const { status } = req.body;
    const usuarioId = req.usuario.id;
    try {
      const registro = await this.service.mudarStatus(registroId, usuarioId, status);
      res.status(200).json(registro);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  buscarDoDia = async (req: Request, res: Response) => {
    const data = String(req.query.data);
    const usuarioId = req.usuario.id;
    if (!data) return res.status(400).json({ error: "Query 'data' (AAAA-MM-DD) obrigatória" });
    try {
      const regs = await this.service.buscarRegistrosDoDia(usuarioId, data);
      res.json(regs);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  buscarHistorico = async (req: Request, res: Response) => {
    const habitoId = Number(req.params.habitoId);
    const usuarioId = req.usuario.id;
    try {
      const historico = await this.service.buscarHistoricoHabito(habitoId, usuarioId);
      res.json(historico);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };
}