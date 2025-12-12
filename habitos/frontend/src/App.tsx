import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './pages/PrivateRoute'; 
import { HabitHistory } from './pages/HabitHistory'; 
import { Layout } from './pages/Layout'; 
import { Configuracoes } from './pages/Configuracoes';
import { Estatisticas } from './pages/Estatisticas';

// 1. IMPORTAR A PÁGINA (NOVO)
import { FocusMode } from './pages/FocusMode';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROTAS PRIVADAS */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/habito/:id" element={<HabitHistory />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            
            {/* 2. ADICIONAR A ROTA AQUI (NOVO) */}
            <Route path="/foco" element={<FocusMode />} />
            
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;