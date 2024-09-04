import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // nao mudes isto ta bem assim

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : '';

  const handleLogout = () => {
    // Remove o token JWT do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('idCentro');
    // Redireciona para a página de login
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#!">Softinsa</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {userRole === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">User Management</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">Event Management</Link>
                </li>

                {/* Adiciona dropdown de Áreas */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="areasDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Áreas
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="areasDropdown">
                    <li><Link className="dropdown-item" to="/areas">Listar Áreas</Link></li>
                    <li><Link className="dropdown-item" to="/subareas">Listar Subáreas</Link></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Reports
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/reportsPorResolver">To Solve</Link></li>
                    <li><Link className="dropdown-item" to="/reportsResolvidos">Solved</Link></li>
                  </ul>
                </li>

                {/* Adiciona dropdown de Comentários */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="commentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Comentários
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="commentsDropdown">
                    <li><Link className="dropdown-item" to="/comments/published">Publicado</Link></li>
                    <li><Link className="dropdown-item" to="/comments/pending">Por Publicar</Link></li>
                  </ul>
                </li>
              </>
            )}
            {userRole === 'master' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/centers">Listagem Centro</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/createCenter">Criar Centro</Link>
                </li>
              </>
            )}
          </ul>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
