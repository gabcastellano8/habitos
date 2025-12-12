import { Request, Response } from "express";
import { HabitoService } from "../service/HabitoService";

export class HabitoController {
  private service = new HabitoService();

  inserir = async (req: Request, res: Response) => {
    const usuarioId = req.usuario.id;
    try {
      const novo = await this.service.inserir(req.body, usuarioId);
      res.status(201).json(novo);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  listar = async (req: Request, res: Response) => {
    const usuarioId = req.usuario.id;
    try {
      const habitos = await this.service.listarPorUsuario(usuarioId);
      res.json(habitos);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  buscarPorId = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;
    try {
      const hab = await this.service.buscarPorId(id, usuarioId);
      res.json(hab);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  atualizar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;
    try {
      const atualizado = await this.service.atualizar(id, req.body, usuarioId);
      res.json(atualizado);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };

  deletar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;
    try {
      const excluido = await this.service.deletar(id, usuarioId);
      res.json(excluido);
    } catch (err: any) {
      res.status(err.id || 500).json({ error: err.msg || "Erro" });
    }
  };
}