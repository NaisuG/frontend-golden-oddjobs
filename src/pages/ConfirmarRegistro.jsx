import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { userPool } from '../auth/cognitoPool';

export default function ConfirmarRegistro() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const confirmar = (e) => {
    e.preventDefault();
    setError('');

    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmRegistration(codigo, true, (err) => {
      if (err) {
        setError(err.message || 'Código inválido');
        return;
      }
      navigate('/login');
    });
  };

  return (
    <div>
      <h1>Confirma tu cuenta</h1>
      <form onSubmit={confirmar}>
        <div>
          <label>Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Código recibido por correo</label>
          <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
}