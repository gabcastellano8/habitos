import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import './Dashboard.css';
import { ScheduleTaskForm } from './ScheduleTaskForm'; 
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; 
import { EditHabitModal } from './EditHabitModal'; 

// --- Tipos de Dados ---
interface HabitoMold {
  id: number;
  nome: string;
  descricao?: string;
}

interface Agendamento {
  id: number; 
  data: string;
  status: 'pendente' | 'feito';
  habito: HabitoMold;
}

interface ResumoItem {
  nome: string;
  feitos: number;
  total: number;
}

// (Tipos para a API de Estatísticas)
interface AgendamentoStats {
  data: string;
  status: 'feito' | 'pendente';
}
interface MoldeEstatistica {
  id: number;
  nome: string;
  agendamentos: AgendamentoStats[];
}
// --- Fim dos Tipos ---

// --- (CORRIGIDO) Funções Helper de Data ---
// Esta função agora ignora o UTC e trata a data como local
const getISODateString = (data: Date): string => {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getStartOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(12, 0, 0, 0); // Define a hora para meio-dia (evita bugs de meia-noite)
  newDate.setDate(newDate.getDate() - newDate.getDay()); // Vai para Domingo
  return newDate;
};

const getEndOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(12, 0, 0, 0); // Define a hora para meio-dia
  newDate.setDate(newDate.getDate() + (6 - newDate.getDay())); // Vai para Sábado
  return newDate;
};
// --- Fim da Correção ---

const formatarDataHeader = (data: Date): string => {
  return data.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
  });
};


export function Dashboard() {
  const [dataExibida, setDataExibida] = useState(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  
  const [semanaCarregada, setSemanaCarregada] = useState(getISODateString(getStartOfWeek(new Date())));
  const [resumoSemanal, setResumoSemanal] = useState<ResumoItem[]>([]);
  const [loadingSemana, setLoadingSemana] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forceReload, setForceReload] = useState(0);
  const [editingHabit, setEditingHabit] = useState<HabitoMold | null>(null);

  // --- P1: LER A AGENDA (useEffect do Dia) ---
  useEffect(() => {
    const fetchAgendaDoDia = async () => {
      setLoading(true);
      setError('');
      const dataString = getISODateString(dataExibida);
      try {
        const response = await api.get(`/agenda?data=${dataString}`);
        setAgendamentos(response.data);
      } catch (err) {
        console.error("Falha ao buscar agenda:", err);
        setError('Não foi possível carregar a agenda. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchAgendaDoDia();
  }, [dataExibida, forceReload]); 

  // --- Hook de Sincronia de Semana (Corrigido) ---
  useEffect(() => {
    const inicioSemanaAtual = getISODateString(getStartOfWeek(dataExibida));
    setSemanaCarregada(semanaAntiga => {
      if (inicioSemanaAtual !== semanaAntiga) {
        return inicioSemanaAtual;
      }
      return semanaAntiga;
    });
  }, [dataExibida]);

  // Busca os dados da semana QUANDO 'semanaCarregada' mudar
  useEffect(() => {
    const fetchDadosDaSemana = async () => {
      setLoadingSemana(true);
      
      // (CORRIGIDO) Cria a data de 'inicio' no fuso local
      const inicio = new Date(semanaCarregada.replace(/-/g, '/')); 
      inicio.setHours(12, 0, 0, 0);
      
      const fim = getEndOfWeek(inicio);
      
      try {
        const response = await api.get(
          `/estatisticas/dados-completos?inicio=${getISODateString(inicio)}&fim=${getISODateString(fim)}`
        );
        
        // (Lógica de processamento - está correta)
        const agrupamento = new Map<string, { feitos: number, total: number }>();
        response.data.forEach((molde: MoldeEstatistica) => { 
          const nome = molde.nome;
          const resumoAtual = agrupamento.get(nome) || { feitos: 0, total: 0 };
          let feitosMolde = 0;
          let totalMolde = 0;
          molde.agendamentos.forEach((ag: AgendamentoStats) => {
            if (ag.status === 'feito') {
              feitosMolde++;
            }
            totalMolde++;
          });
          agrupamento.set(nome, {
            feitos: resumoAtual.feitos + feitosMolde,
            total: resumoAtual.total + totalMolde
          });
        });

        const resultado = Array.from(agrupamento.entries())
          .map(([nome, { feitos, total }]) => ({ nome, feitos, total }))
          .filter(item => item.total > 0) // Filtra hábitos não agendados
          .sort((a, b) => a.nome.localeCompare(b.nome));
          
        setResumoSemanal(resultado);

      } catch (err) {
        console.error("Erro ao buscar resumo semanal:", err);
      } finally {
        setLoadingSemana(false);
      }
    };
    
    fetchDadosDaSemana();
  }, [semanaCarregada, forceReload]); 
  
  
  // --- Calcular o Resumo do Dia ---
  const resumoDoDia: ResumoItem[] = useMemo(() => {
    // ... (lógica igual, sem erros)
    const agrupamento = new Map<string, { feitos: number, total: number }>();
    agendamentos.forEach(ag => {
      const nome = ag.habito.nome;
      const resumoAtual = agrupamento.get(nome) || { feitos: 0, total: 0 };
      agrupamento.set(nome, {
        feitos: resumoAtual.feitos + (ag.status === 'feito' ? 1 : 0),
        total: resumoAtual.total + 1
      });
    });
    return Array.from(agrupamento.entries())
      .map(([nome, { feitos, total }]) => ({ nome, feitos, total }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [agendamentos]);


  // --- P3: MARCAR TAREFA (Checkbox) ---
  const handleToggleTarefa = async (agendamento: Agendamento, isChecked: boolean) => {
    // ... (lógica igual, sem erros)
    const novoStatus = isChecked ? 'feito' : 'pendente';
    setAgendamentos(prev => 
      prev.map(a => a.id === agendamento.id ? { ...a, status: novoStatus } : a)
    );
    try {
      await api.put(`/agenda/${agendamento.id}`, { status: novoStatus });
    } catch (err) {
      setError("Erro ao salvar, tente novamente.");
    }
  };

  // ... (Funções: mudarData, irParaHoje, handleTaskScheduled, handleDeleteMolde, handleHabitUpdated - iguais) ...
  const mudarData = (dias: number) => {
    setDataExibida(dataAtual => {
      const novaData = new Date(dataAtual);
      novaData.setDate(novaData.getDate() + dias);
      return novaData;
    });
  };
  const handleTaskScheduled = () => {
    setForceReload(count => count + 1);
  };
  const handleDeleteMolde = async (habitoId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este 'molde' de tarefa? \n\n(Isso excluirá TODOS os agendamentos futuros para ele.)")) {
      return;
    }
    try {
      await api.delete(`/habitos/${habitoId}`);
      setForceReload(count => count + 1);
    } catch (err) {
      setError("Não foi possível excluir o molde. Tente novamente.");
    }
  };
  const handleHabitUpdated = (habitoAtualizado: HabitoMold) => {
    setAgendamentos(prev =>
      prev.map(ag => 
        ag.habito.id === habitoAtualizado.id
          ? { ...ag, habito: habitoAtualizado }
          : ag
      )
    );
  };

  // Renderização da lista de tarefas
  const renderContent = () => {
    // ... (lógica igual, sem erros)
    if (loading) {
      return <div className="dashboard-state">Carregando agenda...</div>;
    }
    if (error) {
      return <div className="dashboard-state error">{error}</div>;
    }
    if (agendamentos.length === 0) {
      return (
        <div className="dashboard-state">
          <p>Nenhuma tarefa agendada para este dia.</p>
        </div>
      );
    }
    return (
      <ul className="habito-list">
        {agendamentos.map(agendamento => (
          <li key={agendamento.id} className="habito-item">
            <input 
              type="checkbox" 
              checked={agendamento.status === 'feito'}
              onChange={(e) => handleToggleTarefa(agendamento, e.target.checked)}
            />
            <div className="habito-info">
              <span className="habito-nome">{agendamento.habito.nome}</span>
              {agendamento.habito.descricao && (
                <span className="habito-descricao">{agendamento.habito.descricao}</span>
              )}
            </div>
            <div className="habito-actions">
              <button 
                className="icon-button btn-edit" 
                title="Editar Molde"
                onClick={() => setEditingHabit(agendamento.habito)}
              >
                <FaPencilAlt />
              </button>
              <button 
                className="icon-button btn-delete" 
                title="Excluir Molde"
                onClick={() => handleDeleteMolde(agendamento.habito.id)}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="dashboard-top-section">
        
        {/* Coluna da Esquerda (Data + Lista + Resumos) */}
        <div className="dashboard-main-column">
          <div className="date-navigation">
            <button onClick={() => mudarData(-1)} className="date-nav-button">&larr;</button>
            <div className="date-display">
              <h3>{formatarDataHeader(dataExibida)}</h3>
            </div>
            <button onClick={() => mudarData(1)} className="date-nav-button">&rarr;</button>
          </div>
          
          <main>
            {renderContent()}
          </main>

          {/* Card de Resumo do Dia */}
          {agendamentos.length > 0 && (
            <div className="stat-card-summary">
              <h3>Resumo do Dia</h3>
              <ul className="habito-summary-list">
                {resumoDoDia.map(item => (
                  <li key={item.nome} className="habito-summary-item">
                    <span className="habito-name">{item.nome}</span>
                    <span className="habito-count">{item.feitos} / {item.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Card de Resumo Semanal */}
          <div className="stat-card-summary">
            <h3>Resumo Semanal</h3>
            {loadingSemana ? (
              <p className="summary-loading">A carregar resumo semanal...</p>
            ) : resumoSemanal.length > 0 ? (
              <ul className="habito-summary-list">
                {resumoSemanal.map(item => (
                  <li key={item.nome} className="habito-summary-item">
                    <span className="habito-name">{item.nome}</span>
                    <span className="habito-count">{item.feitos} / {item.total}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="summary-loading">Sem agendamentos nesta semana.</p>
            )}
          </div>
        </div>
        
        {/* Coluna da Direita (APENAS Formulário) */}
        <div className="dashboard-sidebar-column">
          <ScheduleTaskForm onTaskScheduled={handleTaskScheduled} />
        </div> 
      
      </div>
      
      {/* Modal de Edição (permanece no fim) */}
      {editingHabit && (
        <EditHabitModal 
          habitoMolde={editingHabit}
          onClose={() => setEditingHabit(null)}
          onHabitUpdated={handleHabitUpdated}
        />
      )}
    </>
  );
}