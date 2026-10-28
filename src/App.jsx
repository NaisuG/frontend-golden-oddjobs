import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import ProtectedRoute from './auth/ProtectedRoute';
import { ROLE } from './auth/roles';
import { attachAuthInterceptor } from './api/apiClient';
import Login from './pages/Login';
import DashboardRequester from './pages/DashboardRequester';
import DashboardDeveloper from './pages/DashboardDeveloper';
import DashboardAdmin from './pages/DashboardAdmin';
import Unauthorized from './pages/Unauthorized';
import Callback from './pages/Callback';
import Register from './pages/Register';
import ConfirmRegistration from './pages/ConfirmRegistration';

export default function App() {
  const auth = useAuth();

  useEffect(() => {
    attachAuthInterceptor(auth);
  }, [auth]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/no-autorizado" element={<Unauthorized />} />
      <Route
        path="/solicitante"
        element={
          <ProtectedRoute allowedRoles={[ROLE.REQUESTER]}>
            <DashboardRequester />
          </ProtectedRoute>
        }
      />
      <Route
        path="/desarrollador"
        element={
          <ProtectedRoute allowedRoles={[ROLE.DEVELOPER]}>
            <DashboardDeveloper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route path="/callback" element={<Callback />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/confirmar" element={<ConfirmRegistration />} />
    </Routes>
  );
}
