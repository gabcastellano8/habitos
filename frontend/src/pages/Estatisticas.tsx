import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import './Estatisticas.css'; 

import CalendarHeatmap from 'react-calendar-heatmap';
import type { ReactCalendarHeatmapValue, TooltipDataAttrs } from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; 

import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
);

// --- Tipos de Dados ---
interface Agendamento {
  data: string;
  status: 'feito' | 'pendente';
}

interface MoldeEstatistica {
  id: number;
  nome: string;
  agendamentos: Agendamento[];
}

// Helper para converter Date para AAAA-MM-DD
const getISODateString = (data: Date): string => {
  return data.toISOString().split('T')[0];
};

// Tipo para a função de classe do calendário
type TileClassNameFunc = ({ date, view }: { date: Date; view: string }) => string | null;


export function Estatisticas() {
  const [dados, setDados] = useState<MoldeEstatistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroHabitoId, setFiltroHabitoId] = useState<string>('todos');

  // Lógica para agrupar por NOME (igual)
  const stackedBarData = useMemo(() => {
    if (dados.length === 0) return null;
    const agrupamento = new Map<string, { feitos: number, pendentes: number }>();
    dados.forEach(molde => {
      const nome = molde.nome; 
      let feitosMolde = 0;
      let pendentesMolde = 0;
      molde.agendamentos.forEach(ag => {
        if (ag.status === 'feito') {
          feitosMolde++;
        } else {
          pendentesMolde++;
        }
      });
      const totalAtual = agrupamento.get(nome) || { feitos: 0, pendentes: 0 };
      agrupamento.set(nome, {
        feitos: totalAtual.feitos + feitosMolde,
        pendentes: totalAtual.pendentes + pendentesMolde,
      });
    });
    const labels: string[] = [];
    const dataFeitos: number[] = [];
    const dataPendentes: number[] = [];
    const agrupamentoOrdenado = new Map([...agrupamento.entries()].sort());
    agrupamentoOrdenado.forEach((valores, nome) => {
      labels.push(nome);
      dataFeitos.push(valores.feitos);
      dataPendentes.push(valores.pendentes);
    });
    return {
      labels,
      datasets: [
        { label: 'Feitos', data: dataFeitos, backgroundColor: '#28a745' },
        { label: 'Pendentes', data: dataPendentes, backgroundColor: '#dee2e6' }
      ]
    };
  }, [dados]);

  // Lógica do Heatmap (igual)
  const heatmapData = useMemo(() => {
    const mapaDatas = new Map<string, number>();
    const dadosFiltrados = filtroHabitoId === 'todos'
      ? dados
      : dados.filter(molde => molde.id === Number(filtroHabitoId));
    dadosFiltrados.forEach(molde => {
      molde.agendamentos.forEach(ag => {
        if (ag.status === 'feito') {
          const count = mapaDatas.get(ag.data) || 0;
          mapaDatas.set(ag.data, count + 1);
        }
      });
    });
    return Array.from(mapaDatas.entries()).map(([data, contagem]) => ({
      date: data,
      count: contagem
    }));
  }, [dados, filtroHabitoId]);

  
  // Buscar dados da API (igual)
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const inicio = getISODateString(ninetyDaysAgo);
        const response = await api.get(`/estatisticas/dados-completos?inicio=${inicio}`);
        setDados(response.data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  
  // Renderização
  if (loading) {
    return <div className="stats-state">Carregando estatísticas...</div>;
  }
  if (error) {
    return <div className="stats-state error">{error}</div>;
  }
  if (!stackedBarData || dados.length === 0) {
    return <div className="stats-state">Não há dados suficientes para exibir estatísticas.</div>;
  }

  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 90);

  return (
    <div className="stats-container">
      <h2>Estatísticas (Últimos 90 dias)</h2>
      
      {/* (MUDANÇA) Grid de 2 colunas */}
      <div className="stats-grid-2-col">
        
        {/* Item 1: Coluna 1, Linha 1 */}
        <div className="stat-card">
          <h3>Carga de Trabalho (Volume)</h3>
          <div className="chart-wrapper-line-bar">
            <Bar
              data={stackedBarData}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true, beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* Item 2: Coluna 2, Linha 1 */}
        <div className="stat-card">
          <h3>Resumo (Feito / Total)</h3>
          <ul className="habito-summary-list">
            {stackedBarData.labels.map((label, index) => {
              const feitos = stackedBarData.datasets[0].data[index];
              const pendentes = stackedBarData.datasets[1].data[index];
              const total = feitos + pendentes;
              if (total === 0) return null; 
              return (
                <li key={label} className="habito-summary-item">
                  <span className="habito-name">{label}</span>
                  <span className="habito-count">{feitos} / {total}</span>
                </li>
              );
            })}
          </ul>
        </div>
          
        {/* Item 3: Coluna 1+2, Linha 2 */}
        <div className="stat-card span-2-cols">
          <div className="heatmap-header">
            <h3>Heatmap de Atividade</h3>
            <select 
              className="stats-filter" 
              value={filtroHabitoId} 
              onChange={(e) => setFiltroHabitoId(e.target.value)}
            >
              <option value="todos">Todos os Hábitos</option>
              {dados.map(molde => (
                <option key={molde.id} value={molde.id}>{molde.nome} (ID: {molde.id})</option>
              ))}
            </select>
          </div>
          <div className="chart-wrapper-heatmap">
            <CalendarHeatmap
              startDate={startDate}
              endDate={today}
              values={heatmapData}
              classForValue={(value: ReactCalendarHeatmapValue<string> | undefined) => {
                if (!value || value.count === 0) return 'color-empty';
                return `color-github-${Math.min(value.count, 4)}`;
              }}
              tooltipDataAttrs={(value: ReactCalendarHeatmapValue<string> | undefined) => {
                if (!value || !value.date) {
                  return { 'data-tip': 'Sem dados' } as TooltipDataAttrs;
                }
                const parts = value.date.split('-');
                const dataObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
                  day: 'numeric', 
                  month: 'long', 
                  timeZone: 'UTC' 
                });
                const count = value.count || 0;
                const plural = count === 1 ? 'tarefa concluída' : 'tarefas concluídas';
                return {
                  'data-tip': `${dataFormatada}: ${count} ${plural}`
                } as TooltipDataAttrs; 
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}