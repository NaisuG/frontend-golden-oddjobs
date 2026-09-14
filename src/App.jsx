import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import ProtectedRoute from './auth/ProtectedRoute';
import { attachAuthInterceptor } from './api/apiClient';
import Login from './pages/Login';
import DashboardSolicitante from './pages/DashboardSolicitante';
import DashboardDesarrollador from './pages/DashboardDesarrollador';
import DashboardAdmin from './pages/DashboardAdmin';
import Unauthorized from './pages/Unauthorized';

export default function App() {
  const auth = useAuth();

  useEffect(() => {
    attachAuthInterceptor(auth);
  }, [auth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/no-autorizado" element={<Unauthorized />} />
      <Route
        path="/solicitante"
        element={
          <ProtectedRoute allowedRoles={['SOLICITANTE']}>
            <DashboardSolicitante />
          </ProtectedRoute>
        }
      />
      <Route
        path="/desarrollador"
        element={
          <ProtectedRoute allowedRoles={['DESARROLLADOR']}>
            <DashboardDesarrollador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
