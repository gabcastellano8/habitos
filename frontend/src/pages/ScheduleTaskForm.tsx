import { useState } from 'react';
import Calendar from 'react-calendar';
import { api } from '../services/api';

import 'react-calendar/dist/Calendar.css'; 
import './ScheduleTaskForm.css'; 

// --- Tipos de Dados ---
// Helper para converter Date para AAAA-MM-DD
const getISODateString = (data: Date): string => {
  return data.toISOString().split('T')[0];
};

type TileClassNameFunc = ({ date, view }: { date: Date; view: string }) => string | null;

interface ScheduleTaskFormProps {
  onTaskScheduled: () => void;
}

export function ScheduleTaskForm({ onTaskScheduled }: ScheduleTaskFormProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  
  // 1. Nosso novo estado manual para datas (em formato string)
  const [datasSelecionadas, setDatasSelecionadas] = useState<string[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  /**
   * 2. (NOVO) Lógica manual de clique
   * Chamado toda vez que o usuário clica em um dia.
   */
  const handleDayClick = (data: Date) => {
    const dataString = getISODateString(data);
    
    // Verifica se a data já está no array
    if (datasSelecionadas.includes(dataString)) {
      // Se sim, remove (desseleciona)
      setDatasSelecionadas(prev => prev.filter(d => d !== dataString));
    } else {
      // Se não, adiciona (seleciona)
      setDatasSelecionadas(prev => [...prev, dataString]);
    }
  };

  /**
   * 3. (NOVO) Lógica para pintar os dias selecionados
   * Esta função é passada para o Calendário.
   */
  const tileClassName: TileClassNameFunc = ({ date, view }) => {
    if (view === 'month') {
      const dateString = getISODateString(date);
      // Se a data estiver no nosso array, aplica a classe "dia-selecionado"
      if (datasSelecionadas.includes(dateString)) {
        return 'dia-selecionado';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validação
    if (!nome) {
      setError('O nome da tarefa é obrigatório.');
      setLoading(false);
      return;
    }
    
    if (datasSelecionadas.length === 0) {
      setError('Selecione pelo menos uma data no calendário.');
      setLoading(false);
      return;
    }
    
    // O array 'datasSelecionadas' já está no formato certo (string[])
    try {
      // Chamar Endpoint P2
      await api.post('/habitos', {
        nome,
        descricao,
        datas: datasSelecionadas
      });

      // Sucesso e Limpeza
      setSuccess(`Tarefa "${nome}" agendada com sucesso!`);
      setNome('');
      setDescricao('');
      setDatasSelecionadas([]); // Limpa o estado
      
      onTaskScheduled();

    } catch (err: any) {
      console.error("Erro ao agendar tarefa:", err);
      setError("Falha ao agendar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-task-form-container">
      <h4>Criar Hábito</h4>
      <form onSubmit={handleSubmit}>
        {/* ... (inputs de nome e descrição - iguais a antes) ... */}
        <div className="form-group">
          <label htmlFor="task-nome">Nome do Hábito:</label>
          <input
            id="task-nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Ir à academia"
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-descricao">Descrição (Opcional):</label>
          <input
            id="task-descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Treino de peito"
          />
        </div>

        <div className="form-group">
          <label>Selecione os dias no calendário:</label>
          
          {/* 4. (MODIFICADO) O Calendário agora usa nossas novas props */}
          <Calendar
            onClickDay={handleDayClick}        // Prop para clique
            tileClassName={tileClassName}     // Prop para pintar os dias
            minDate={new Date()}              // Prop para não selecionar passado
            className="habito-calendar"
            // Removemos 'onChange', 'value' e 'selectMultiple'
          />
        </div>
        
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="create-button" disabled={loading}>
          {loading ? 'Agendando...' : 'Agendar Tarefas'}
        </button>
      </form>
    </div>
  );
}