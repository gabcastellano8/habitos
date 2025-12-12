import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../services/api';
import './Estatisticas.css'; 
import { FaFire, FaCheck, FaChartLine } from 'react-icons/fa';

import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Agendamento {
  data: string;
  status: 'feito' | 'pendente';
}

interface MoldeEstatistica {
  id: number;
  nome: string;
  agendamentos: Agendamento[];
  firstDate?: string;
}

interface TimelineData {
  days: {
    dateString: string;
    dayNumber: number;
    weekdayInitial: string;
    monthIndex: number; 
  }[];
  months: {
    name: string;
    daysCount: number;
  }[];
}

const getDaysOfWeek = () => {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay() + 1; 
  const days = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(curr.setDate(first + i));
    days.push({
      dateObj: new Date(next),
      dateString: next.toISOString().split('T')[0],
      dayName: next.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }
  return days;
};

export function Estatisticas() {
  const [dadosBrutos, setDadosBrutos] = useState<MoldeEstatistica[]>([]);
  const [loading, setLoading] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const weekDays = useMemo(() => getDaysOfWeek(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/estatisticas/dados-completos?inicio=2020-01-01`); 
        setDadosBrutos(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dadosAgrupados = useMemo(() => {
    const map = new Map<string, MoldeEstatistica>();
    
    dadosBrutos.forEach(item => {
      const nomeChave = item.nome.trim().toLowerCase();
      
      if (!map.has(nomeChave)) {
        map.set(nomeChave, { 
          ...item, 
          nome: item.nome.trim(), 
          agendamentos: [...item.agendamentos] 
        });
      } else {
        const existente = map.get(nomeChave)!;
        existente.agendamentos = [...existente.agendamentos, ...item.agendamentos];
      }
    });

    const agrupados = Array.from(map.values());
    
    agrupados.forEach(habito => {
      if (habito.agendamentos.length > 0) {
        habito.agendamentos.sort((a, b) => a.data.localeCompare(b.data));
        habito.firstDate = habito.agendamentos[0].data;
      }
    });

    return agrupados;
  }, [dadosBrutos]);

  const timeline = useMemo<TimelineData>(() => {
    if (dadosAgrupados.length === 0) return { days: [], months: [] };

    let minDateString = new Date().toISOString().split('T')[0];
    
    dadosAgrupados.forEach(h => {
       const sorted = [...h.agendamentos].sort((a,b) => a.data.localeCompare(b.data));
       if (sorted.length > 0 && sorted[0].data < minDateString) {
         minDateString = sorted[0].data;
       }
    });

    const minDate = new Date(minDateString);
    minDate.setHours(12, 0, 0, 0); 

    const today = new Date();
    today.setHours(23, 59, 59, 999); 

    const days = [];
    const monthsMap = new Map<string, number>();
    const current = new Date(minDate);
    
    while (current <= today) {
      const monthName = current.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      monthsMap.set(monthName, (monthsMap.get(monthName) || 0) + 1);

      days.push({
        dateString: current.toISOString().split('T')[0],
        dayNumber: current.getDate(),
        weekdayInitial: current.toLocaleDateString('pt-BR', { weekday: 'narrow' }),
        monthIndex: current.getMonth()
      });

      current.setDate(current.getDate() + 1);
    }

    const months = Array.from(monthsMap.entries()).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      daysCount: count
    }));

    return { days, months };
  }, [dadosAgrupados]);

  useEffect(() => {
    if (!loading && tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollWidth;
    }
  }, [loading, timeline]);

  const barData = useMemo(() => {
    const habitsWithCount = dadosAgrupados.map(d => {
      const feitos = d.agendamentos.filter(a => a.status === 'feito').length;
      const rate = (feitos / (timeline.days.length || 1)) * 100; 
      return { name: d.nome, count: feitos, rate };
    });
    habitsWithCount.sort((a, b) => b.count - a.count);

    return {
      labels: habitsWithCount.map(h => h.name),
      datasets: [{
        label: 'Vezes realizado',
        data: habitsWithCount.map(h => h.count),
        backgroundColor: habitsWithCount.map(h => {
          if (h.rate >= 80) return '#66bb6a'; 
          if (h.rate >= 50) return '#ffa726'; 
          return '#ef5350'; 
        }),
        borderRadius: 6, 
        barThickness: 20, 
      }]
    };
  }, [dadosAgrupados, timeline]);

  const getDayStatus = (molde: MoldeEstatistica, dateString: string) => {
    const registro = molde.agendamentos.find(a => a.data === dateString);

    if (!registro) {
      return 'empty'; 
    }

    if (registro.status === 'feito') {
      return 'done'; 
    }

    if (registro.status === 'pendente') {
      const todayString = new Date().toISOString().split('T')[0];
      if (dateString < todayString) {
        return 'missed'; 
      }
      return 'empty'; 
    }

    return 'empty';
  };

  const getTotalDone = (molde: MoldeEstatistica) => {
    return molde.agendamentos.filter(a => a.status === 'feito').length;
  };

  if (loading) return <div className="loading-stats">Carregando histórico...</div>;

  return (
    <div className="stats-container">
      
      <div className="radar-header">
        <div>
          <h2>Analytics</h2>
          <p className="subtitle">Seu desempenho desde o início</p>
        </div>
        <div className="coin-icon">📊</div>
      </div>

      {/* VISÃO SEMANAL */}
      <div className="section-divider">
        <h3>Visão Semanal Detalhada</h3>
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

        {dadosAgrupados.map((habit, index) => {
          const total = getTotalDone(habit);
          const bgColors = ['#e8f5e9', '#fff3e0', '#f3e5f5', '#e1f5fe', '#fbe9e7'];
          const cardColor = bgColors[index % bgColors.length];

          return (
            <div key={habit.id || index} className="habit-card" style={{ backgroundColor: cardColor }}>
              <div className="habit-info-col">
                <div className="habit-text">
                  <h3 className="habit-title">{habit.nome}</h3>
                  <div className="habit-streak">
                    <FaFire className="fire-icon" /> 
                    <span>{total} Dias</span>
                  </div>
                </div>
              </div>
              <div className="habit-days-col">
                {weekDays.map(day => {
                  const status = getDayStatus(habit, day.dateString);
                  
                  return (
                    <div key={day.dateString} className="day-circle-wrapper">
                      <div className={`day-circle ${status}`}>
                        {status === 'done' && <FaCheck size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-divider" style={{ marginTop: '3rem' }}>
        <h3>Histórico Completo</h3>
      </div>

      <div className="monthly-grid-container">
        <div className="monthly-table-wrapper" ref={tableContainerRef}>
          <table className="monthly-table">
            <thead>
              <tr>
                <th className="sticky-col-header habit-header-cell" rowSpan={2}>Hábito</th>
                {timeline.months.map((month, idx) => (
                  <th key={idx} colSpan={month.daysCount} className="month-header">
                    {month.name}
                  </th>
                ))}
              </tr>
              <tr>
                {timeline.days.map(day => (
                  <th key={day.dateString} className="day-header">
                    <span className="day-num">{day.dayNumber}</span>
                    <span className="day-week">{day.weekdayInitial}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dadosAgrupados.map((habit) => (
                <tr key={habit.id || habit.nome}>
                  <td className="sticky-col-cell">
                    <span className="habit-name-cell">{habit.nome}</span>
                  </td>
                  {timeline.days.map(day => {
                    const status = getDayStatus(habit, day.dateString);
                    const isFuture = day.dateString > new Date().toISOString().split('T')[0];
                    
                    let dotClass = 'future';
                    if (status === 'done') dotClass = 'done';
                    else if (status === 'missed') dotClass = 'missed';
                    else if (!isFuture) dotClass = 'future';

                    return (
                      <td key={day.dateString} className="status-cell">
                        <div className={`status-dot ${dotClass}`}></div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="section-divider" style={{ marginTop: '3rem' }}>
        <h3>Ranking Total (Frequência)</h3>
      </div>
      
      <div className="charts-overview">
        <div className="chart-card bar-card">
          <div className="card-header">
            <FaChartLine className="card-icon chart" />
            <h3>Frequência Absoluta</h3>
          </div>
          <div className="chart-wrapper-bar">
            <Bar 
              data={barData} 
              options={{
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                  x: { display: true, beginAtZero: true, grid: { display: false }, border: { display: true }, ticks: { stepSize: 1, font: { family: 'Inter', size: 11 }, color: '#888' } }, 
                  y: { grid: { display: false }, border: { display: false }, ticks: { font: { family: 'Inter', size: 12, weight: 500 }, color: '#333' } } 
                }
              }} 
            />
          </div>
        </div>
      </div>

    </div>
  );
}