import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const EstabelecimentosPendentes = () => {
  const [ativos, setAtivos] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Novo estado para modal de delete
  const [currentEstabelecimento, setCurrentEstabelecimento] = useState(null);
  const [updatedEstabelecimento, setUpdatedEstabelecimento] = useState({
    nome: '',
    localizacao: '',
    contacto: '',
    descricao: '',
    precoMedio: '',
    linkLocalizacao: ''
  });

  const [estabelecimentoToDelete, setEstabelecimentoToDelete] = useState(null); // Estado para apagar

  useEffect(() => {
    const idCentro = localStorage.getItem('idCentro');

    if (!idCentro) {
      setError('ID do centro não encontrado.');
      return;
    }

    const fetchEstabelecimentosAtivos = async () => {
      try {
        const response = await axios.get(`https://backend-9hij.onrender.com/estab/centro/inativos/${idCentro}`);
        setAtivos(response.data.establishments);
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos ativos:', error);
      }
    };

    fetchEstabelecimentosAtivos();
  }, []);

  const handleEdit = (estabelecimento) => {
    setCurrentEstabelecimento(estabelecimento);
    setUpdatedEstabelecimento({
      nome: estabelecimento.nome,
      localizacao: estabelecimento.localizacao,
      contacto: estabelecimento.contacto,
      descricao: estabelecimento.descricao,
      precoMedio: estabelecimento.precoMedio,
      linkLocalizacao: estabelecimento.linkLocalizacao
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://backend-9hij.onrender.com/estab/alterar/${currentEstabelecimento.id}`, updatedEstabelecimento);
      setAtivos(
        ativos.map((estab) => (estab.id === currentEstabelecimento.id ? { ...estab, ...updatedEstabelecimento } : estab))
      );
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao atualizar o estabelecimento:', error);
      setError('Erro ao atualizar o estabelecimento.');
    }
  };

  const handleDelete = (estabelecimento) => {
    setEstabelecimentoToDelete(estabelecimento);
    setShowDeleteModal(true); // Exibe o modal de confirmação de exclusão
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://backend-9hij.onrender.com/estab/apagar/${estabelecimentoToDelete.id}`);
      setAtivos(ativos.filter((estab) => estab.id !== estabelecimentoToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao apagar o estabelecimento:', error);
      setError('Erro ao apagar o estabelecimento.');
    }
  };

  const handleActivate = async (estabelecimento) => {
    try {
      await axios.put(`https://backend-9hij.onrender.com/estab/ativar/${estabelecimento.id}`);
      setAtivos(
        ativos.map((estab) => (estab.id === estabelecimento.id ? { ...estab, ativo: true } : estab))
      );
    } catch (error) {
      console.error('Erro ao ativar o estabelecimento:', error);
      setError('Erro ao ativar o estabelecimento.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Estabelecimentos Publicados</h1>
      {error && <p className="text-danger">{error}</p>}
<Table striped bordered hover className="mt-3">
  <thead>
    <tr>
      <th>Imagem</th> {/* Nova coluna para a imagem */}
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
          <td>
            <img
              src={estabelecimento.foto}
              alt={estabelecimento.nome}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </td>
          <td>{estabelecimento.nome}</td>
          <td>{estabelecimento.localizacao}</td>
          <td>{estabelecimento.contacto}</td>
          <td>{estabelecimento.precoMedio}</td>
          <td>
            <Button variant="warning" onClick={() => handleEdit(estabelecimento)}>
              Editar
            </Button>{' '}
            <Button variant="danger" onClick={() => handleDelete(estabelecimento)}>
              Apagar
            </Button>{' '}
            {!estabelecimento.ativo && (
              <Button variant="success" onClick={() => handleActivate(estabelecimento)}>
                Ativar
              </Button>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center">Nenhum estabelecimento publicado encontrado.</td>
      </tr>
    )}
  </tbody>
</Table>


      {/* Modal de Edição */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Estabelecimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={updatedEstabelecimento.nome}
                onChange={(e) => setUpdatedEstabelecimento({ ...updatedEstabelecimento, nome: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLocalizacao">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                value={updatedEstabelecimento.localizacao}
                onChange={(e) => setUpdatedEstabelecimento({ ...updatedEstabelecimento, localizacao: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formContacto">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                value={updatedEstabelecimento.contacto}
                onChange={(e) => setUpdatedEstabelecimento({ ...updatedEstabelecimento, contacto: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedEstabelecimento.descricao}
                onChange={(e) => setUpdatedEstabelecimento({ ...updatedEstabelecimento, descricao: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPrecoMedio">
              <Form.Label>Preço Médio</Form.Label>
              <Form.Control
                type="text"
                value={updatedEstabelecimento.precoMedio}
                onChange={(e) => setUpdatedEstabelecimento({ ...updatedEstabelecimento, precoMedio: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLinkLocalizacao">
              <Form.Label>Link de Localização</Form.Label>
              <Form.Control
                type="text"
                value={updatedEstabelecimento.linkLocalizacao}
                onChange={(e) => setUpdatedEstabelecimento({ ...updatedEstabelecimento, linkLocalizacao: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação de Apagar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja apagar o estabelecimento "{estabelecimentoToDelete?.nome}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Apagar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EstabelecimentosPendentes;
