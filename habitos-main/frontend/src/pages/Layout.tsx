import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Target } from 'lucide-react'; // Ou FaCrosshairs do react-icons
import { api } from '../services/api';
import './Layout.css'; 
import { 
  FaSignOutAlt, 
  FaTachometerAlt, // Dashboard
  FaChartBar,      // Estatísticas
  FaCog            // Configurações
} from 'react-icons/fa'; 

export function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    // A DIV "app-layout" foi removida.
    <>
      {/* O Sidebar Lateral Fixo */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>HabitSPA</h1>
        </div>
        
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/dashboard" className="sidebar-link">
              <FaTachometerAlt />
              <span>Ínicio</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/estatisticas" className="sidebar-link">
              <FaChartBar />
              <span>Relatórios</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/foco" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Target size={20} />
              <span>Modo Foco</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuracoes" className="sidebar-link">
              <FaCog />
              <span>Configurações</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-link logout-button" title="Sair">
            <FaSignOutAlt />
            <span>Sair</span>
          </button>
        </div>
      </nav>

      {/* O Conteúdo da Página */}
      <main className="app-content">
        <Outlet />
      </main>
    </>
  );
}