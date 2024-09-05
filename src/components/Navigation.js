import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Don't change this, it's correctly set up.

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idCentro');
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
                  <Link className="nav-link" to="/users">Utilizadores</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">Eventos</Link>
                </li>

                {/* Dropdown for Áreas */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="areasDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Áreas
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="areasDropdown">
                    <li><Link className="dropdown-item" to="/areas">Áreas</Link></li>
                    <li><Link className="dropdown-item" to="/subareas">Subáreas</Link></li>
                  </ul>
                </li>

                {/* Dropdown for Comentários */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="commentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Comentários
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="commentsDropdown">
                    <li><Link className="dropdown-item" to="/comments/published">Publicado</Link></li>
                    <li><Link className="dropdown-item" to="/comments/pending">Por Publicar</Link></li>
                  </ul>
                </li>

                {/* New Dropdown for Estabelecimentos */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="estabelecimentosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Estabelecimentos
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="estabelecimentosDropdown">
                    <li><Link className="dropdown-item" to="/establishments/active">Ativos</Link></li>
                    <li><Link className="dropdown-item" to="/establishments/inactive">Por Ativar</Link></li>
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
