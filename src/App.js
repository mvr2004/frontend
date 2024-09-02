import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './views/listar_User';
import Navigation from './components/Navigation';
import ReportsList from './views/listar_Reports';
import VerReport from './views/ver_Report';
import EventManagement from './views/listar_Events';
import CenterManagement from './views/listar_Centros';
import CriarCentros from './views/criar_Centros';
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
        <Route 
          path="/events" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EventManagement />
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
