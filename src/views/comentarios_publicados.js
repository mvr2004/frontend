import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Pagination, Button, Modal } from 'react-bootstrap';

const ComentariosPublicados = () => {
  const [comentarios, setComentarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    const idCentro = localStorage.getItem('idCentro');

    if (!idCentro) {
      setError('ID do centro não encontrado.');
      return;
    }

    const fetchComentariosPublicados = async () => {
      try {
        const response = await axios.get(`https://backend-9hij.onrender.com/comentario/${idCentro}/comentarios-publicados`);
        setComentarios(response.data.comentarios);
      } catch (error) {
        console.error('Erro ao buscar comentários publicados:', error);
        setError('Erro ao buscar comentários publicados.');
      }
    };

    fetchComentariosPublicados();
  }, []);

  const eliminarComentario = async () => {
    if (selectedCommentId) {
      try {
        await axios.delete(`https://backend-9hij.onrender.com/comentario/${selectedCommentId}`);
        setComentarios(comentarios.filter(comentario => comentario.id !== selectedCommentId));
        setShowModal(false);
      } catch (error) {
        console.error('Erro ao eliminar comentário:', error);
        setError('Erro ao eliminar comentário.');
      }
    }
  };

const resetarDenuncias = async (id) => {
  try {
    const response = await axios.patch(`https://backend-9hij.onrender.com/comentario/${id}/resetar-denuncias`);

    const updatedComentario = response.data.comentario;

    // Buscar o evento, utilizador e outros dados novamente (ou garantir que a API retorne esses dados já no reset)
    const comentarioAtualizado = comentarios.find(comentario => comentario.id === id);
    
    const updatedComentarioCompleto = {
      ...comentarioAtualizado,
      denuncias: updatedComentario.denuncias // Atualiza apenas as denúncias
    };

    // Atualizar o estado com o comentário completo
    setComentarios((prevComentarios) =>
      prevComentarios.map((comentario) =>
        comentario.id === id ? updatedComentarioCompleto : comentario
      )
    );
  } catch (error) {
    console.error('Erro ao resetar denúncias do comentário:', error);
    setError('Erro ao resetar denúncias do comentário.');
  }
};


  const handleShowModal = (id) => {
    setSelectedCommentId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCommentId(null);
    setShowModal(false);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComentarios = comentarios.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comentarios.length / commentsPerPage);

  const handleClick = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Comentários Publicados</h1>
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Conteúdo</th>
            <th>ID do Publicador</th>
            <th>Nome do Publicador</th>
            <th>Denúncias</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentComentarios.length > 0 ? (
            currentComentarios.map((comentario) => (
              <tr key={comentario.id}>
                <td>{comentario.nome}</td>
                <td>{comentario.tipo}</td>
                <td>{comentario.conteudo}</td>
                <td>{comentario.utilizadorId}</td>
                <td>{comentario.nomeUtilizador}</td>
                <td>{comentario.denuncias}</td>
                <td>
                  <Button variant="danger" onClick={() => handleShowModal(comentario.id)}>Eliminar</Button>{' '}
                  <Button variant="warning" onClick={() => resetarDenuncias(comentario.id)}>Resetar Denúncias</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">Nenhum comentário publicado encontrado.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handleClick(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal de Confirmação */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminação</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja eliminar este comentário?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarComentario}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComentariosPublicados;
