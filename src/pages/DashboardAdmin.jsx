import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { cerrarSesionCompleta } from '../auth/cognitoLogout';

export default function DashboardAdmin() {
  const auth = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    apiClient.get('/api/admin/solicitudes').then((res) => setSolicitudes(res.data));
  }, []);

  return (
    <div>
      <h1>Panel de administración</h1>
      <p>Hola, {auth.user?.profile?.email}</p>
      <p>Total de solicitudes en la plataforma: {solicitudes.length}</p>
      <button onClick={() => { auth.removeUser(); cerrarSesionCompleta(); }}>Cerrar sesión</button>
    </div>
  );
}
