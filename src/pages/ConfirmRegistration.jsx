import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../auth/cognitoPool';

export default function ConfirmRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = (event) => {
    event.preventDefault();
    setError('');

    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        setError(err.message || 'Código inválido');
        return;
      }
      navigate('/login');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Confirma tu cuenta</h1>
        <p className="text-ink/60 mb-8">Ingresa el código que te enviamos por correo.</p>
        <form onSubmit={handleConfirm} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Código</label>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              className="w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          {error && <p className="text-rust text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gold text-white font-semibold py-3 rounded hover:opacity-90 transition"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
