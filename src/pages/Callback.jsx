import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { ROLE, getRoles } from '../auth/roles';

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
  if (roles.includes(ROLE.ADMIN)) return <Navigate to="/admin" replace />;
  if (roles.includes(ROLE.DEVELOPER)) return <Navigate to="/desarrollador" replace />;
  return <Navigate to="/solicitante" replace />;
}
