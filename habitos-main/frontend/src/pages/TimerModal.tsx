import { useState, useEffect } from 'react';
import { FaStop, FaTimes, FaCheckCircle } from 'react-icons/fa';
import './TimerModal.css'; // Vamos definir o CSS abaixo

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  onComplete: () => void; // A função crítica que marca como feito
}

export function TimerModal({ isOpen, onClose, habitName, onComplete }: TimerModalProps) {
  const [mode, setMode] = useState<'config' | 'running'>('config');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Padrão 25 min em segundos
  const [customMin, setCustomMin] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Reseta o modal quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      setMode('config');
      setIsActive(false);
      setTimeLeft(25 * 60);
    }
  }, [isOpen]);

  // Lógica do Timer (Core)
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // CRÍTICO: Chegou a zero
      clearInterval(interval);
      setIsActive(false);
      onComplete(); // Executa a conclusão automática
      onClose(); // Fecha o modal
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete, onClose]);

  if (!isOpen) return null;

  // Formata MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setMode('running');
    setIsActive(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content focus-modal">
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        
        <h3 className="focus-habit-title">Focando em: <br/><span>{habitName}</span></h3>

        {mode === 'config' ? (
          <div className="focus-config">
            <p>Quanto tempo você vai dedicar?</p>
            
            <div className="time-presets">
              <button onClick={() => handleStart(15)}>15 min</button>
              <button onClick={() => handleStart(25)}>25 min</button>
              <button onClick={() => handleStart(45)}>45 min</button>
            </div>

            <div className="custom-time">
              <input 
                type="number" 
                placeholder="Minutos" 
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
              />
              <button 
                className="btn-start-custom"
                disabled={!customMin}
                onClick={() => handleStart(Number(customMin))}
              >
                Começar
              </button>
            </div>
          </div>
        ) : (
          <div className="focus-running">
            <div className="timer-display">
              {formatTime(timeLeft)}
            </div>
            
            <div className="timer-controls">
              <button 
                className="btn-stop" 
                onClick={() => { setIsActive(false); setMode('config'); }}
              >
                <FaStop /> Parar
              </button>
              {/* Botão de concluir antecipadamente opcional */}
              <button className="btn-finish-now" onClick={onComplete}>
                <FaCheckCircle /> Concluir Já
              </button>
            </div>
            <p className="focus-message">Mantenha o foco!</p>
          </div>
        )}
      </div>
    </div>
  );
}