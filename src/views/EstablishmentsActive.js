import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';

const EstabelecimentosPublicados = () => {
  const [ativos, setAtivos] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEstabelecimento, setCurrentEstabelecimento] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [estabelecimentosPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para termo de pesquisa

  useEffect(() => {
    const fetchEstabelecimentosAtivos = async () => {
      const idCentro = localStorage.getItem('idCentro');
      if (!idCentro) {
        setError('ID do centro não encontrado.');
        return;
      }

      try {
        // Buscar estabelecimentos ativos sem paginação
        const response = await axios.get(`https://backend-9hij.onrender.com/estab/centro/ativos/${idCentro}`);
        setAtivos(response.data.establishments); // Assumindo que a resposta tem 'establishments'
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos ativos:', error);
        setError('Erro ao buscar estabelecimentos ativos.');
      }
    };

    fetchEstabelecimentosAtivos();
  }, []); // Apenas carregamento inicial, sem paginação

  const handleDelete = (estabelecimento) => {
    setCurrentEstabelecimento(estabelecimento);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://backend-9hij.onrender.com/estab/apagar/${currentEstabelecimento.id}`);
      setShowDeleteModal(false);
      window.location.reload(); // Recarrega a página após a exclusão
    } catch (error) {
      console.error('Erro ao apagar estabelecimento:', error);
      setError('Erro ao apagar estabelecimento.');
    }
  };

  // Função de Paginação
  const indexOfLastEstabelecimento = currentPage * estabelecimentosPerPage;
  const indexOfFirstEstabelecimento = indexOfLastEstabelecimento - estabelecimentosPerPage;

  // Filtrar estabelecimentos com base no termo de pesquisa
  const filteredEstabelecimentos = ativos.filter((estabelecimento) =>
    estabelecimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estabelecimento.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estabelecimento.contacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentEstabelecimentos = filteredEstabelecimentos.slice(indexOfFirstEstabelecimento, indexOfLastEstabelecimento);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Estabelecimentos Publicados</h1>
      {error && <p className="text-danger">{error}</p>}

      {/* Barra de pesquisa */}
      <Form.Control
        type="text"
        placeholder="Pesquisar estabelecimentos..."
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tabela de Estabelecimentos */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Localização</th>
            <th>Contacto</th>
            <th>Preço Médio</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentEstabelecimentos.length > 0 ? (
            currentEstabelecimentos.map((estabelecimento) => (
              <tr key={estabelecimento.id}>
                <td>{estabelecimento.nome}</td>
                <td>{estabelecimento.localizacao}</td>
                <td>{estabelecimento.contacto}</td>
                <td>{estabelecimento.precoMedio}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(estabelecimento)}>Eliminar</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">Nenhum estabelecimento publicado encontrado.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Paginação */}
      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(filteredEstabelecimentos.length / estabelecimentosPerPage)).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja eliminar o estabelecimento "{currentEstabelecimento?.nome}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EstabelecimentosPublicados;
