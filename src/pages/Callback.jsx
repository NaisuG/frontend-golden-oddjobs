import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

function getRoles(user) {
  const grupos = user?.profile?.['cognito:groups'];
  if (!grupos) return [];
  return Array.isArray(grupos) ? grupos : [grupos];
}

export default function Callback() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-ink/60">Procesando inicio de sesión...</p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = getRoles(auth.user);
  if (roles.includes('ADMIN')) return <Navigate to="/admin" replace />;
  if (roles.includes('DESARROLLADOR')) return <Navigate to="/desarrollador" replace />;
  return <Navigate to="/solicitante" replace />;
}
