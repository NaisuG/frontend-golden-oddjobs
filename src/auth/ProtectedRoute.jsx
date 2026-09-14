import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

function getRoles(user) {
  const grupos = user?.profile?.['cognito:groups'];
  if (!grupos) return [];
  return Array.isArray(grupos) ? grupos : [grupos];
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = getRoles(auth.user);
  const autorizado = !allowedRoles || allowedRoles.some((rol) => roles.includes(rol));

  if (!autorizado) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
