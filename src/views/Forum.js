import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForumView = () => {
  const [forums, setForums] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [forumsPerPage] = useState(10);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const centroId = localStorage.getItem('idCentro'); // Obtém o ID do centro
        console.log('Centro ID:', centroId);

        if (!centroId) {
          throw new Error('ID do centro não encontrado');
        }

        const response = await axios.get('https://backend-9hij.onrender.com/forum/list2', {
          params: { centroId } // Passa o ID do centro como parâmetro
        });

        console.log('Forums response:', response.data);
        setForums(response.data);
      } catch (error) {
        console.error('Error fetching forums:', error);
        setError('Erro ao carregar os fóruns.');
      }
    };

    fetchForums();
  }, []);

  const handleActivate = async (id) => {
    try {
      await axios.put(`https://backend-9hij.onrender.com/forum/activate/${id}`);
      setForums(forums.map(forum =>
        forum.id === id ? { ...forum, ativo: true } : forum
      ));
    } catch (error) {
      console.error('Erro ao ativar fórum:', error);
      setError('Erro ao ativar o fórum.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este fórum?')) {
      try {
        await axios.delete(`https://backend-9hij.onrender.com/forum/delete/${id}`);
        setForums(forums.filter(forum => forum.id !== id));
      } catch (error) {
        console.error('Erro ao eliminar fórum:', error);
        setError('Erro ao eliminar o fórum.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Paginate
  const indexOfLastForum = currentPage * forumsPerPage;
  const indexOfFirstForum = indexOfLastForum - forumsPerPage;
  const currentForums = forums.slice(indexOfFirstForum, indexOfLastForum);

  // Filter forums by search term
  const filteredForums = currentForums.filter(forum =>
    forum.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h1>Fóruns</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por nome..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Área</th>
              <th>Subárea</th>
              <th>Centro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredForums.length > 0 ? (
              filteredForums.map(forum => (
                <tr key={forum.id}>
                  <td>{forum.id}</td>
                  <td>{forum.titulo}</td>
                  <td>{forum.descricao}</td>
                  <td>{forum.Area ? forum.Area.nomeArea : 'N/A'}</td>
                  <td>{forum.Subarea ? forum.Subarea.nomeSubarea : 'N/A'}</td>
                  <td>{forum.Centro ? forum.Centro.centro : 'N/A'}</td>
                  <td>{forum.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    {!forum.ativo && (
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleActivate(forum.id)}
                      >
                        Ativar
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(forum.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">Sem fóruns disponíveis.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination">
          {[...Array(Math.ceil(forums.length / forumsPerPage)).keys()].map(number => (
            <li key={number + 1} className="page-item">
              <button
                onClick={() => paginate(number + 1)}
                className="page-link"
              >
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ForumView;
