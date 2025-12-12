import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TimerModal } from './TimerModal'; 
import toast, { Toaster } from 'react-hot-toast';
import { FaBullseye, FaPlay } from 'react-icons/fa'; 
import './FocusMode.css'; 

interface HabitoDetalhe {
  id: number;
  nome?: string;
  name?: string; 
  titulo?: string;
  descricao?: string;
}

interface AgendaItem {
  id: number;      
  data: string;    
  status: string;  
  habito: HabitoDetalhe; 
}

export function FocusMode() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayDebug, setTodayDebug] = useState(''); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<AgendaItem | null>(null);

  // Helper para garantir o nome (igual ao Dashboard)
  const getHabitName = (h: any) => {
    if (!h) return "Tarefa sem nome";
    return h.nome || h.name || h.titulo || "Sem Nome";
  };

  const fetchHabits = async () => {
    try {
      setLoading(true);
      
      const today = new Date().toLocaleDateString('en-CA'); 
      setTodayDebug(today);

      console.log("📅 Buscando agenda de:", today);

      const response = await api.get(`/agenda?data=${today}`);
      
      const pendentes = response.data
        .filter((item: AgendaItem) => item.status === 'pendente')
        .map((item: AgendaItem) => ({
          ...item,
          habito: {
            ...item.habito,
            nome: getHabitName(item.habito) // Garante o nome aqui
          }
        }));
      
      console.log("✅ Pendentes:", pendentes);
      setItems(pendentes);

    } catch (error) {
      console.error("❌ Erro:", error);
      toast.error("Erro ao carregar tarefas."); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleOpenFocus = (item: AgendaItem) => {
    setActiveItem(item);
    setIsModalOpen(true);
  };

  const markAsDone = async () => {
    if (!activeItem) return;

    try {
      console.log(`Tentando PUT /agenda/${activeItem.id}`);

      await api.put(`/agenda/${activeItem.id}`, { status: 'feito' });
      
      setItems(prev => prev.filter(i => i.id !== activeItem.id));
      setIsModalOpen(false);
      
      toast.success(`"${activeItem.habito.nome}" concluído! 🎉`, {
        duration: 4000,
        position: 'top-center',
        style: { background: '#4caf50', color: '#fff', fontWeight: 'bold' }
      });

    } catch (error: any) {
      console.error("❌ Erro na API:", error);
      
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Erro de conexão.";
      
      if (status === 404) {
        toast.error(`Erro 404: Rota PUT /agenda/${activeItem.id} não encontrada.`);
      } else {
        toast.error(`Erro ${status}: ${msg}`);
      }
    }
  };

  return (
    <div className="focus-page-container">
      <Toaster />
      
      <header className="focus-header">
        <div className="icon-wrapper">
          <FaBullseye />
        </div>
        <div>
          <h2>Modo Foco</h2>
          <p>Selecione uma tarefa e elimine distrações.</p>
          <small style={{ color: '#ccc', fontSize: '0.75rem' }}>Data: {todayDebug}</small>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <p className="loading-text">Carregando tarefas...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state-focus">
          <h3>Tudo limpo por hoje! 🚀</h3>
          <p>Você concluiu todas as suas tarefas pendentes.</p>
          <button className="btn-refresh" onClick={fetchHabits}>Atualizar Lista</button>
        </div>
      ) : (
        <div className="focus-grid">
          {items.map(item => (
            <div key={item.id} className="focus-card">
              <div className="focus-card-content">
                <h3>{item.habito.nome}</h3>
                <span className="focus-badge">Pendente</span>
              </div>
              
              <button 
                className="btn-play-focus" 
                onClick={() => handleOpenFocus(item)}
              >
                <FaPlay className="play-icon" /> Focar
              </button>
            </div>
          ))}
        </div>
      )}

      {activeItem && (
        <TimerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          habitName={activeItem.habito.nome || "Tarefa"}
          onComplete={markAsDone}
        />
      )}
    </div>
  );
}