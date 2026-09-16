import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { cerrarSesionCompleta } from '../auth/cognitoLogout';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardAdmin() {
  const auth = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    apiClient.get('/api/admin/solicitudes').then((res) => setSolicitudes(res.data));
  }, []);

  return (
    <DashboardLayout
      roleLabel="Admin"
      roleColor="navy"
      email={auth.user?.profile?.email}
      onLogout={() => { auth.removeUser(); cerrarSesionCompleta(); }}
    >
      <div className="border-l-4 border-navy bg-white rounded p-6">
        <p className="text-ink/60 mb-1">Total de solicitudes en la plataforma</p>
        <p className="font-display text-5xl font-semibold text-navy">{solicitudes.length}</p>
      </div>
    </DashboardLayout>
  );
}
