import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

export function PrivateRoute() {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}