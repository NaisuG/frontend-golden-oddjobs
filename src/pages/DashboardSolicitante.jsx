import { useAuth } from 'react-oidc-context';
import apiClient from '../api/apiClient';

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
    <div>
      <h1>Panel del solicitante</h1>
      <p>Hola, {auth.user?.profile?.email}</p>
      <button onClick={crearSolicitud}>Crear solicitud de prueba</button>
      <button onClick={() => auth.removeUser()}>Cerrar sesión</button>
    </div>
  );
}
