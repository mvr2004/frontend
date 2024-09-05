import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table, Spinner } from 'react-bootstrap';

const AreaManager = () => {
  const [areas, setAreas] = useState([]);
  const [nomeArea, setNomeArea] = useState('');
  const [icon, setIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://backend-9hij.onrender.com/areas/list');
      setAreas(response.data.areas);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao buscar áreas:', err);
      setError('Erro ao buscar áreas.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleFileChange = (e) => {
    setIcon(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nomeArea', nomeArea);
    if (icon) {
      formData.append('icon', icon);
    }

    try {
      if (editingAreaId) {
        await axios.put(`https://backend-9hij.onrender.com/areas/edit_area/${editingAreaId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditingAreaId(null);
      } else {
        await axios.post('https://backend-9hij.onrender.com/areas/create_areas', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setNomeArea('');
      setIcon(null);
      setShowModal(false);
      fetchAreas();
    } catch (err) {
      console.error('Erro ao criar ou editar área:', err);
      setError('Erro ao criar ou editar a área.');
    }
  };

  const handleEditClick = (area) => {
    setEditingAreaId(area.id);
    setNomeArea(area.nomeArea);
    setShowModal(true);
  };

  const handleShowModal = () => {
    setEditingAreaId(null);
    setNomeArea('');
    setIcon(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gerenciamento de Áreas</h1>

      <Button variant="primary" onClick={handleShowModal} className="mb-4">
        Criar Nova Área
      </Button>

      {isLoading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da Área</th>
              <th>Ícone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id}>
                <td>{area.id}</td>
                <td>{area.nomeArea}</td>
                <td>
                  {area.icon && <img src={area.icon} alt={area.nomeArea} width={50} />}
                </td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEditClick(area)}>
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para criação e edição de área */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAreaId ? 'Editar Área' : 'Criar Nova Área'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNomeArea">
              <Form.Label>Nome da Área</Form.Label>
              <Form.Control
                type="text"
                value={nomeArea}
                onChange={(e) => setNomeArea(e.target.value)}
                placeholder="Digite o nome da área"
                required
              />
            </Form.Group>
            <Form.Group controlId="formIcon">
              <Form.Label>Ícone</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                className="form-control-file"
              />
            </Form.Group>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="primary" type="submit">
                {editingAreaId ? 'Atualizar Área' : 'Criar Área'}
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

export default AreaManager;
