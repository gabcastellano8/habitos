import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { api } from '../services/api';

import 'react-calendar/dist/Calendar.css'; 
import './HabitHistory.css'; 

// --- Tipos de Dados ---
interface Habito {
  id: number;
  nome: string;
}

interface RegistroHistorico {
  id: number;
  data: string;
  status: string;
}

type TileClassNameFunc = ({ date, view }: { date: Date; view: string }) => string | null;

export function HabitHistory() {
  const { id } = useParams<{ id: string }>();

  const [habito, setHabito] = useState<Habito | null>(null);
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchHistoryData = async () => {
      setLoading(true);
      setError('');
      try {
        const [habitoResponse, historicoResponse] = await Promise.all([
          api.get(`/habitos/${id}`),          
          api.get(`/registros/historico/${id}`) 
        ]);

        setHabito(habitoResponse.data);
        setHistorico(historicoResponse.data);
        
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setError("Não foi possível carregar o histórico deste hábito.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [id]); 

  // Lógica para colorir o calendário
  const getTileClassName: TileClassNameFunc = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const registroDoDia = historico.find(r => r.data === dateString);

      if (registroDoDia) {
        if (registroDoDia.status === 'feito') {
          return 'habito-feito'; 
        }
        if (registroDoDia.status === 'nao_feito') {
          return 'habito-nao-feito'; 
        }
      }
    }
    return null; 
  };

  // Renderização
  if (loading) {
    return <div className="history-state">Carregando histórico...</div>;
  }

  if (error) {
    return <div className="history-state error">{error}</div>;
  }

  // (Removido o .history-container, pois o .app-content é o container)
  return (
    <>
      <Link to="/dashboard" className="back-link">
        &larr; Voltar ao Dashboard
      </Link>

      <h2 className="history-title">
        Histórico de: <span className="habito-name">{habito?.nome}</span>
      </h2>

      <div className="calendar-wrapper-container">
        <Calendar
          tileClassName={getTileClassName}
          locale="pt-BR"
          className="habito-calendar"
        />
        
        <div className="legend">
          <div className="legend-item">
            <span className="color-box feito"></span> Hábito Concluído
          </div>
          <div className="legend-item">
            <span className="color-box nao-feito"></span> Hábito Não Concluído
          </div>
        </div>
      </div>
    </>
  );
}