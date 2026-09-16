import { useAuth } from 'react-oidc-context';
import { Link } from 'react-router-dom';

export default function Login() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper px-6">
        <p className="text-ink/70">Ya iniciaste sesión como {auth.user?.profile?.email}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-4xl font-semibold text-ink mb-2">Golden-Oddjobs</h1>
        <p className="text-ink/60 mb-8">Encuentra a quien construya tu próxima app, o tu próximo proyecto.</p>
        <button
          onClick={() => auth.signinRedirect()}
          className="w-full bg-gold text-white font-semibold py-3 rounded hover:opacity-90 transition"
        >
          Iniciar sesión
        </button>
        <p className="mt-6 text-sm text-ink/60">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-gold font-semibold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
