import { useAuth } from 'react-oidc-context';
import { Link } from 'react-router-dom';

export default function Login() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <p>Ya iniciaste sesión como {auth.user?.profile?.email}</p>;
  }

  return (
    <div>
      <h1>Golden-Oddjobs</h1>
      <button onClick={() => auth.signinRedirect()}>Iniciar sesión</button>
      <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
    </div>
  );
}
