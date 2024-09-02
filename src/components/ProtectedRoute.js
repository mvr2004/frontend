import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrigido para exportação nomeada

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  // Se o papel do usuário não corresponde ao papel necessário, redireciona para a página inicial apropriada
  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'master') {
      return <Navigate to="/centers" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
