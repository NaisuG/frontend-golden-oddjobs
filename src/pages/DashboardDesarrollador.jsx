import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { cerrarSesionCompleta } from '../auth/cognitoLogout';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardDesarrollador() {
  const auth = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    apiClient.get('/api/solicitudes/disponibles').then((res) => setSolicitudes(res.data));
  }, []);

  return (
    <DashboardLayout
      roleLabel="Desarrollador"
      roleColor="teal"
      email={auth.user?.profile?.email}
      onLogout={() => { auth.removeUser(); cerrarSesionCompleta(); }}
    >
      <h2 className="font-display text-2xl font-semibold text-ink mb-4">Solicitudes disponibles</h2>
      {solicitudes.length === 0 ? (
        <p className="text-ink/60">Todavía no hay solicitudes publicadas.</p>
      ) : (
        <ul className="space-y-3">
          {solicitudes.map((s) => (
            <li key={s.id} className="border-l-4 border-teal bg-white rounded p-4">
              <p className="font-semibold text-ink">{s.titulo}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  );
}
