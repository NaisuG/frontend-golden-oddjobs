import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from '../auth/cognitoPool';
import axios from 'axios';

const ROLES = [
  { value: 'SOLICITANTE', label: 'Quiero pedir una app', desc: 'Publica lo que necesitas y recibe propuestas.' },
  { value: 'DESARROLLADOR', label: 'Quiero desarrollar', desc: 'Postúlate a proyectos con tu propio precio.' }
];

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('SOLICITANTE');
  const [error, setError] = useState('');

  const registrar = (e) => {
    e.preventDefault();
    setError('');

    const atributos = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'custom:rol', Value: rol })
    ];

    userPool.signUp(email, password, atributos, null, async (err) => {
      if (err) {
        setError(err.message || 'No se pudo registrar');
        return;
      }
      try {
        await axios.post(`${import.meta.env.VITE_USUARIOS_SERVICE_URL}/api/auth/asignar-grupo`, { email, rol });
      } catch (e) {
        console.error('No se pudo asignar el grupo', e);
      }
      navigate('/confirmar', { state: { email } });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Crear cuenta</h1>
        <p className="text-ink/60 mb-8">Elige cómo quieres usar Golden-Oddjobs.</p>

        <form onSubmit={registrar} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setRol(r.value)}
                className={`text-left rounded border p-4 transition ${
                  rol === r.value ? 'border-gold bg-gold/10' : 'border-ink/15 hover:border-ink/30'
                }`}
              >
                <p className="font-semibold text-ink">{r.label}</p>
                <p className="text-sm text-ink/60 mt-1">{r.desc}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-ink/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {error && <p className="text-rust text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gold text-white font-semibold py-3 rounded hover:opacity-90 transition"
          >
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
}
