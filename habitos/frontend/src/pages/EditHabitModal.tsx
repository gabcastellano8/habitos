import { useState, useEffect } from 'react';
import { api } from '../services/api';

import './EditHabitModal.css';

interface HabitoMold {
  id: number;
  nome: string;
  descricao?: string;
}

interface EditModalProps {
  habitoMolde: HabitoMold; 
  onClose: () => void; 
  onHabitUpdated: (habitoAtualizado: HabitoMold) => void; 
}

export function EditHabitModal({ habitoMolde, onClose, onHabitUpdated }: EditModalProps) {
  const [nome, setNome] = useState(habitoMolde.nome);
  const [descricao, setDescricao] = useState(habitoMolde.descricao || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNome(habitoMolde.nome);
    setDescricao(habitoMolde.descricao || '');
  }, [habitoMolde]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!nome.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    setLoading(true);

    try {
      const response = await api.put(`/habitos/${habitoMolde.id}`, {
        nome,
        descricao,
      });

      onHabitUpdated(response.data);
      onClose(); 

    } catch (err: any) {
      console.error("Erro ao atualizar molde:", err);
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Molde da Tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-nome">Nome:</label>
            <input
              id="edit-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-descricao">Descrição (Opcional):</label>
            <input
              id="edit-descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}