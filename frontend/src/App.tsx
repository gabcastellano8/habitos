import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './pages/PrivateRoute'; 
import { HabitHistory } from './pages/HabitHistory'; 
import { Layout } from './pages/Layout'; 
import { WeeklyView } from './pages/WeeklyView';
import { Estatisticas } from './pages/Estatisticas';
import { Configuracoes } from './pages/Configuracoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS (Sem Layout/Sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROTAS PRIVADAS (Com Layout/Sidebar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/habito/:id" element={<HabitHistory />} />
            
            {/* 2. Adicionar as novas rotas */}
            {/*<Route path="/estatisticas" element={<WeeklyView />} /> */}
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Route>

        {/* Rota Padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;