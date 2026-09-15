import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from '../auth/cognitoPool';
import axios from 'axios';

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
    <div>
      <h1>Crear cuenta en Golden-Oddjobs</h1>
      <form onSubmit={registrar}>
        <div>
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>
            <input type="radio" name="rol" value="SOLICITANTE" checked={rol === 'SOLICITANTE'} onChange={() => setRol('SOLICITANTE')} />
            Quiero pedir una app (Solicitante)
          </label>
          <label>
            <input type="radio" name="rol" value="DESARROLLADOR" checked={rol === 'DESARROLLADOR'} onChange={() => setRol('DESARROLLADOR')} />
            Quiero desarrollar (Desarrollador)
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}