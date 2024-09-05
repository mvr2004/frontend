import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const EstabelecimentosPublicados = () => {
  const [ativos, setAtivos] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEstabelecimento, setNewEstabelecimento] = useState({
    nome: '',
    localizacao: '',
    contacto: '',
    descricao: '',
    pago: false,
    precoMedio: '',
    linkLocalizacao: ''
  });
  const [currentEstabelecimento, setCurrentEstabelecimento] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const idCentro = localStorage.getItem('idCentro');

    if (!idCentro) {
      setError('ID do centro não encontrado.');
      return;
    }

    const fetchEstabelecimentosAtivos = async () => {
      try {
        const response = await axios.get(`https://backend-9hij.onrender.com/estab/centro/ativos/${idCentro}`);
        setAtivos(response.data.establishments);
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos ativos:', error);
        setError('Erro ao buscar estabelecimentos ativos.');
      }
    };

    fetchEstabelecimentosAtivos();
  }, []);

  const handleCreateActive = async () => {
    try {
      await axios.post('https://backend-9hij.onrender.com/estab/criarativo', newEstabelecimento);
      setShowModal(false);
      setNewEstabelecimento({
        nome: '',
        localizacao: '',
        contacto: '',
        descricao: '',
        pago: false,
        precoMedio: '',
        linkLocalizacao: ''
      });
      window.location.reload(); // Recarrega a página após a criação
    } catch (error) {
      console.error('Erro ao criar estabelecimento ativo:', error);
      setError('Erro ao criar estabelecimento ativo.');
    }
  };

  const handleEdit = (estabelecimento) => {
    setCurrentEstabelecimento(estabelecimento);
    setNewEstabelecimento({
      nome: estabelecimento.nome,
      localizacao: estabelecimento.localizacao,
      contacto: estabelecimento.contacto,
      descricao: estabelecimento.descricao,
      pago: estabelecimento.pago,
      precoMedio: estabelecimento.precoMedio,
      linkLocalizacao: estabelecimento.linkLocalizacao
    });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`https://backend-9hij.onrender.com/estab/alterar/${currentEstabelecimento.id}`, newEstabelecimento);
      setShowModal(false);
      window.location.reload(); // Recarrega a página após a alteração
    } catch (error) {
      console.error('Erro ao alterar estabelecimento:', error);
      setError('Erro ao alterar estabelecimento.');
    }
  };

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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Estabelecimentos Publicados</h1>
      {error && <p className="text-danger">{error}</p>}
      <Button variant="primary" onClick={() => setShowModal(true)}>Criar Estabelecimento Ativo</Button>
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
          {ativos.length > 0 ? (
            ativos.map((estabelecimento) => (
              <tr key={estabelecimento.id}>
                <td>{estabelecimento.nome}</td>
                <td>{estabelecimento.localizacao}</td>
                <td>{estabelecimento.contacto}</td>
                <td>{estabelecimento.precoMedio}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(estabelecimento)}>Alterar</Button>{' '}
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

      {/* Modal para criar ou editar estabelecimento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEstabelecimento ? 'Alterar' : 'Criar'} Estabelecimento Ativo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={newEstabelecimento.nome}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={newEstabelecimento.localizacao}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, localizacao: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                value={newEstabelecimento.contacto}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, contacto: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Preço Médio</Form.Label>
              <Form.Control
                type="text"
                value={newEstabelecimento.precoMedio}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, precoMedio: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEstabelecimento.descricao}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, descricao: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Pago"
                checked={newEstabelecimento.pago}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, pago: e.target.checked })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Link da Localização</Form.Label>
              <Form.Control
                type="text"
                value={newEstabelecimento.linkLocalizacao}
                onChange={(e) => setNewEstabelecimento({ ...newEstabelecimento, linkLocalizacao: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={currentEstabelecimento ? handleSaveEdit : handleCreateActive}>
            {currentEstabelecimento ? 'Salvar Alterações' : 'Criar'}
          </Button>
        </Modal.Footer>
      </Modal>

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
