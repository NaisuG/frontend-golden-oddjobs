import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';
import { cerrarSesionCompleta } from '../auth/cognitoLogout';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardSolicitante() {
  const auth = useAuth();

  const crearSolicitud = async () => {
    await apiClient.post('/api/solicitudes', {
      titulo: 'App de ejemplo',
      descripcion: 'Descripción de prueba',
      tipoApp: 'WEB'
    });
  };

  return (
    <DashboardLayout
      roleLabel="Solicitante"
      roleColor="rust"
      email={auth.user?.profile?.email}
      onLogout={() => { auth.removeUser(); cerrarSesionCompleta(); }}
    >
      <div className="border-l-4 border-rust bg-white rounded p-6">
        <h2 className="font-display text-2xl font-semibold text-ink mb-2">Publica lo que necesitas</h2>
        <p className="text-ink/60 mb-6">Crea una solicitud de ejemplo para ver el flujo completo.</p>
        <button
          onClick={crearSolicitud}
          className="bg-rust text-white font-semibold px-5 py-2.5 rounded hover:opacity-90 transition"
        >
          Crear solicitud de prueba
        </button>
      </div>
    </DashboardLayout>
  );
}
