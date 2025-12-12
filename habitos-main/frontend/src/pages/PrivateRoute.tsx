import { Navigate, Outlet } from 'react-router-dom';

/**
 * Verifica se há um token no localStorage.
 * (Num app maior, isso viria de um Context API)
 */
const useAuth = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

/**
 * O "Porteiro":
 * - Se o usuário estiver logado (useAuth = true), 
 * ele renderiza o <Outlet /> (que será o Dashboard).
 * - Se não, ele redireciona para /login.
 */
export function PrivateRoute() {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}