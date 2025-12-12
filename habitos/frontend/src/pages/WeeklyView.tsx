import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import './WeeklyView.css'; 
import { FaFire, FaCheck } from 'react-icons/fa'; // Ícones de Fogo e Check

interface Agendamento {
  data: string;
  status: 'feito' | 'pendente';
}

interface MoldeEstatistica {
  id: number;
  nome: string;
  agendamentos: Agendamento[];
}

const getDaysOfWeek = () => {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay() + 1; 
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(curr.setDate(first + i));
    days.push({
      dateObj: next,
      dateString: next.toISOString().split('T')[0], // AAAA-MM-DD
      dayName: next.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '') // seg, ter...
    });
  }
  return days;
};

export function WeeklyView() {
  const [dados, setDados] = useState<MoldeEstatistica[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Gerar os 7 dias da semana atual
  const weekDays = useMemo(() => getDaysOfWeek(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/estatisticas/dados-completos'); 
        setDados(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const checkStatus = (molde: MoldeEstatistica, dateString: string) => {
    const registro = molde.agendamentos.find(a => a.data === dateString);
    return registro?.status === 'feito';
  };

  const getTotalDone = (molde: MoldeEstatistica) => {
    return molde.agendamentos.filter(a => a.status === 'feito').length;
  };

  if (loading) return <div className="loading-week">Carregando sua semana...</div>;

  return (
    <div className="weekly-container">
      <div className="weekly-header">
        <h2>Weekly View</h2>
        <div className="week-legend">
          📅 {weekDays[0].dayName} {weekDays[0].dateObj.getDate()} - {weekDays[6].dayName} {weekDays[6].dateObj.getDate()}
        </div>
      </div>

      <div className="habits-grid">
        <div className="grid-header">
          <div className="spacer"></div> 
          <div className="days-row">
            {weekDays.map(day => (
              <span key={day.dateString} className="day-label">
                {day.dayName}
              </span>
            ))}
          </div>
        </div>

        {dados.map((habit, index) => {
          const total = getTotalDone(habit);
          const bgColors = ['#e8f5e9', '#fff3e0', '#f3e5f5', '#e1f5fe', '#fbe9e7'];
          const cardColor = bgColors[index % bgColors.length];

          return (
            <div key={habit.id} className="habit-card" style={{ backgroundColor: cardColor }}>
              
              <div className="habit-info-col">
                <h3 className="habit-title">{habit.nome}</h3>
                <div className="habit-streak">
                  <FaFire className="fire-icon" /> 
                  <span>{total} Dias</span>
                </div>
              </div>

              <div className="habit-days-col">
                {weekDays.map(day => {
                  const isDone = checkStatus(habit, day.dateString);
                  const isToday = day.dateString === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div key={day.dateString} className={`day-circle-wrapper ${isToday ? 'today' : ''}`}>
                      <div className={`day-circle ${isDone ? 'done' : 'empty'}`}>
                        {isDone && <FaCheck />}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}