import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { fullSignOut } from '../auth/cognitoLogout';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardDeveloper() {
  const auth = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiClient.get('/api/solicitudes/disponibles')
      .then((response) => setRequests(response.data.map(({ id, titulo }) => ({ id, title: titulo }))));
  }, []);

  return (
    <DashboardLayout
      roleLabel="Desarrollador"
      roleColor="teal"
      email={auth.user?.profile?.email}
      onLogout={() => { auth.removeUser(); fullSignOut(); }}
    >
      <h2 className="font-display text-2xl font-semibold text-ink mb-4">Solicitudes disponibles</h2>
      {requests.length === 0 ? (
        <p className="text-ink/60">Todavía no hay solicitudes publicadas.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id} className="border-l-4 border-teal bg-white rounded p-4">
              <p className="font-semibold text-ink">{request.title}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  );
}
