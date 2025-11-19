import { Router } from "express";
import { LoginController } from "../controller/LoginController";
import { UsuarioController } from "../controller/UsuarioController";
import { HabitoController } from "../controller/HabitoController";
import { RegistroHabitoController } from "../controller/RegistroHabitoController";
import { TokenMiddleware } from "../middleware/TokenMiddleware";
import { EstatisticaController } from "../controller/EstatisticaController"; // Adicionado

const router = Router();
const loginController = new LoginController();
const usuarioController = new UsuarioController();
const habitoController = new HabitoController();
const agendaController = new RegistroHabitoController(); 
const estatisticaController = new EstatisticaController(); // Adicionado
const tokenMiddleware = new TokenMiddleware();

// --- Rotas Públicas ---
router.post("/login", loginController.realizarLogin);
router.post("/usuarios", usuarioController.inserir);

// --- Middleware de Autenticação ---
router.use(tokenMiddleware.verificarAcesso);

// --- Rotas Protegidas ---

// P1: O Endpoint "Core" para ler a agenda
router.get("/agenda", agendaController.buscarDoDia);

// P3: O "Checkbox" para marcar/desmarcar
router.put("/agenda/:id", agendaController.mudarStatus);

// P2: Rota para criar um "molde" de Hábito e agendá-lo
router.post("/habitos", habitoController.inserir);

// Rotas de manutenção dos "moldes" de Hábito
router.get("/habitos", habitoController.listar);
router.get("/habitos/:id", habitoController.buscarPorId);
router.put("/habitos/:id", habitoController.atualizar); // P3
router.delete("/habitos/:id", habitoController.deletar); // P3

// Rota de Estatísticas
router.get("/estatisticas/dados-completos", estatisticaController.dadosCompletos); // Adicionado

// Rota de histórico (mantida por enquanto, mas pode ser P4)
router.get("/registros/historico/:habitoId", agendaController.buscarHistorico);

export default router;