import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './views/listar_User';
import Navigation from './components/Navigation';
import ReportsList from './views/listar_Reports';
import VerReport from './views/ver_Report';
import CenterManagement from './views/listar_Centros';
import CriarCentros from './views/criar_Centros';
import ListarAreas from './views/ListarAreas';
import ListarSubareas from './views/ListarSubareas';
import PublishedCommentsPage from './views/comentarios_publicados';
import EventosAtivos from './views/eventos_ativos';
import EventosInativos from './views/eventos_inativos';
import PendingCommentsPage from './views/comentarios_pendentes';
import EstablishmentsActive from './views/EstablishmentsActive';
import EstablishmentsInactive from './views/EstablishmentsInactive';
import Forum from './views/Forum'; // Import the new Forum component
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Navigation />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        {/* Rotas para eventos */}
        <Route 
          path="/events/active" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EventosAtivos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/inactive" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EventosInativos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reportsPorResolver" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ReportsList resolvido={false} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reportsResolvidos" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ReportsList resolvido={true} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <VerReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/centers" 
          element={
            <ProtectedRoute requiredRole="master">
              <CenterManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/createCenter" 
          element={
            <ProtectedRoute requiredRole="master">
              <CriarCentros />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/areas" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ListarAreas />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/subareas" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ListarSubareas />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/comments/published" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PublishedCommentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/comments/pending" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PendingCommentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/establishments/active" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EstablishmentsActive />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/establishments/inactive" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EstablishmentsInactive />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forum" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Forum />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
