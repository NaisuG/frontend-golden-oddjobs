import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { getRoles } from './roles';

export default function ProtectedRoute({ children, allowedRoles }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = getRoles(auth.user);
  const isAuthorized = !allowedRoles || allowedRoles.some((role) => roles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
