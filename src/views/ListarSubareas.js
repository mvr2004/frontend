import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table, Spinner } from 'react-bootstrap';

const SubareaManager = () => {
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [nomeSubarea, setNomeSubarea] = useState('');
  const [areaId, setAreaId] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(''); // Estado para filtro de área
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSubareaId, setEditingSubareaId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subareasPerPage] = useState(10); // Definindo o número de subáreas por página

  const fetchAreas = async () => {
    try {
      const response = await axios.get('https://backend-9hij.onrender.com/areas/list');
      setAreas(response.data.areas);
    } catch (err) {
      console.error('Erro ao buscar áreas:', err);
      setError('Erro ao buscar áreas.');
    }
  };

  const fetchSubareas = async (filter = '', page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://backend-9hij.onrender.com/areas/list-subareas', {
        params: {
          areaId: filter,
          page: page,
          limit: subareasPerPage
        }
      });
      // Ordenar as subáreas alfabeticamente por nome
      const sortedSubareas = response.data.subareas.sort((a, b) => a.nomeSubarea.localeCompare(b.nomeSubarea));
      setSubareas(sortedSubareas);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao buscar subáreas:', err);
      setError('Erro ao buscar subáreas.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchSubareas(selectedFilter, currentPage);
  }, [selectedFilter, currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSubareaId) {
        await axios.put(`https://backend-9hij.onrender.com/areas/edit_subarea/${editingSubareaId}`, {
          nomeSubarea,
          areaId,
        });
        setEditingSubareaId(null);
      } else {
        await axios.post('https://backend-9hij.onrender.com/areas/create_subareas', {
          nomeSubarea,
          areaId,
        });
      }

      setNomeSubarea('');
      setAreaId('');
      setShowModal(false);
      fetchSubareas(selectedFilter, currentPage);
    } catch (err) {
      console.error('Erro ao criar ou editar subárea:', err);
      setError('Erro ao criar ou editar a subárea.');
    }
  };

  const handleEditClick = (subarea) => {
    setEditingSubareaId(subarea.id);
    setNomeSubarea(subarea.nomeSubarea);
    setAreaId(subarea.areaId);
    setShowModal(true);
  };

  const handleShowModal = () => {
    setEditingSubareaId(null);
    setNomeSubarea('');
    setAreaId('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setCurrentPage(1); // Resetar a página ao aplicar um novo filtro
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchSubareas(selectedFilter, newPage);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gerenciamento de Subáreas</h1>

      <Button variant="primary" onClick={handleShowModal} className="mb-4">
        Criar Nova Subárea
      </Button>

      <Form.Group controlId="formFilter" className="mb-4">
        <Form.Label>Filtrar por Área</Form.Label>
        <Form.Control
          as="select"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="">Todas as Áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nomeArea}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {isLoading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome da Subárea</th>
                <th>Área</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {subareas.map((subarea) => (
                <tr key={subarea.id}>
                  <td>{subarea.id}</td>
                  <td>{subarea.nomeSubarea}</td>
                  <td>{areas.find(area => area.id === subarea.areaId)?.nomeArea || 'Não disponível'}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleEditClick(subarea)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Paginação */}
          <div className="d-flex justify-content-between mt-3">
            <Button 
              variant="secondary" 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span> Página {currentPage} </span>
            <Button 
              variant="secondary" 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Próxima
            </Button>
          </div>
        </>
      )}

      {/* Modal para criação e edição de subárea */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSubareaId ? 'Editar Subárea' : 'Criar Nova Subárea'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNomeSubarea">
              <Form.Label>Nome da Subárea</Form.Label>
              <Form.Control
                type="text"
                value={nomeSubarea}
                onChange={(e) => setNomeSubarea(e.target.value)}
                placeholder="Digite o nome da subárea"
                required
              />
            </Form.Group>
            <Form.Group controlId="formAreaId">
              <Form.Label>Área</Form.Label>
              <Form.Control
                as="select"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                required
              >
                <option value="">Selecione a área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nomeArea}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="primary" type="submit">
                {editingSubareaId ? 'Atualizar Subárea' : 'Criar Subárea'}
              </Button>
              <Button variant="danger" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubareaManager;
