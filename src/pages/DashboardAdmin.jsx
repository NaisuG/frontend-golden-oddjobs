import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { fullSignOut } from '../auth/cognitoLogout';
import DashboardLayout from '../components/DashboardLayout';
import ReportsPanel from '../components/ReportsPanel';

export default function DashboardAdmin() {
  const auth = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiClient.get('/api/admin/solicitudes').then((response) => setRequests(response.data));
  }, []);

  return (
    <DashboardLayout
      roleLabel="Admin"
      roleColor="navy"
      email={auth.user?.profile?.email}
      onLogout={() => { auth.removeUser(); fullSignOut(); }}
    >
      <div className="border-l-4 border-navy bg-white rounded p-6">
        <p className="text-ink/60 mb-1">Total de solicitudes en la plataforma</p>
        <p className="font-display text-5xl font-semibold text-navy">{requests.length}</p>
      </div>
      <ReportsPanel />
    </DashboardLayout>
  );
}
