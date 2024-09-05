import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

const CenterManagement = () => {
  const [centros, setCentros] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCentro, setCurrentCentro] = useState({});
  const [newCentroName, setNewCentroName] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCentros();
    fetchDistritos(); // Carregar a lista de distritos
  }, [currentPage]);

  const fetchCentros = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://backend-9hij.onrender.com/centros/list', {
        params: { page: currentPage, limit: 10 },
      });
      setCentros(response.data.centros);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar centros:', error);
      setErrorMessage('Erro ao carregar a lista de centros');
      setIsLoading(false);
    }
  };

  const fetchDistritos = async () => {
    try {
      const response = await axios.get('https://backend-9hij.onrender.com/centros/distritos');
      setDistritos(response.data);
    } catch (error) {
      console.error('Erro ao buscar distritos:', error);
      setErrorMessage('Erro ao carregar a lista de distritos');
    }
  };

  const handleEditModalOpen = (centro) => {
    setCurrentCentro(centro);
    setNewCentroName(centro.centro);
    setSelectedDistrito(centro.distrito || '');
    setNewAdminPassword(''); // Reset admin password
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setCurrentCentro({});
    setNewCentroName('');
    setSelectedDistrito('');
    setNewAdminPassword('');
    setShowEditModal(false);
  };

  const handleEditCentro = async () => {
    try {
      const { id } = currentCentro;
      const updatedCentro = {
        novoCentro: newCentroName,
        novoDistrito: selectedDistrito,
        novaPalavraPasse: newAdminPassword, // Add this field
      };

      // Sending the updated center details to the backend
      await axios.put(`https://backend-9hij.onrender.com/centros/edit/${id}`, updatedCentro);

      // Fetch the updated list of centers after the edit
      fetchCentros();
      setShowEditModal(false);
    } catch (error) {
      console.error('Erro ao editar centro:', error);
      setErrorMessage('Erro ao editar o centro');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderCentrosTable = () => {
    return (
      <Table striped bordered hover responsive="md" className="mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Nome do Centro</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {centros.map((centro) => (
            <tr key={centro.id}>
              <td>{centro.centro}</td>
              <td>
                <img src={centro.fotos} alt={centro.centro} width="100" />
              </td>
              <td>
                <Button variant="warning" onClick={() => handleEditModalOpen(centro)}>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      );
    }

    return <Pagination>{items}</Pagination>;
  };

  return (
    <div className="container mt-5">
      <h1>Centros</h1>
      <Card>
        <Card.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {isLoading ? <p>Carregando...</p> : renderCentrosTable()}
          {renderPagination()}
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Centro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCentroName">
              <Form.Label>Novo Nome do Centro</Form.Label>
              <Form.Control
                type="text"
                value={newCentroName}
                onChange={(e) => setNewCentroName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDistritoSelect" className="mt-3">
              <Form.Label>Selecione o Distrito</Form.Label>
              <Form.Control
                as="select"
                value={selectedDistrito}
                onChange={(e) => setSelectedDistrito(e.target.value)}
              >
                <option value="">Selecione um distrito</option>
                {distritos.map((distrito) => (
                  <option key={distrito.name} value={distrito.name}>
                    {distrito.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAdminPassword" className="mt-3">
              <Form.Label>Nova Senha do Admin</Form.Label>
              <Form.Control
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="Digite uma nova senha (deixe em branco para manter a atual)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditCentro}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CenterManagement;
