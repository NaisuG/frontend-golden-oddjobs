import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { cerrarSesionCompleta } from '../auth/cognitoLogout';

export default function DashboardDesarrollador() {
  const auth = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    apiClient.get('/api/solicitudes/disponibles').then((res) => setSolicitudes(res.data));
  }, []);

  return (
    <div>
      <h1>Panel del desarrollador</h1>
      <p>Hola, {auth.user?.profile?.email}</p>
      <ul>
        {solicitudes.map((s) => (
          <li key={s.id}>{s.titulo}</li>
        ))}
      </ul>
      <button onClick={() => { auth.removeUser(); cerrarSesionCompleta(); }}>Cerrar sesión</button>
    </div>
  );
}
