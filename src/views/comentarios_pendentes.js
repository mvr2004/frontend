import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Table } from 'react-bootstrap';

const PendingCommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://backend-9hij.onrender.com/comentario/por-publicar');
        setComments(response.data.comentarios);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao buscar comentários por publicar:', err);
        setError('Erro ao buscar comentários por publicar.');
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Comentários Por Publicar</h1>

      {isLoading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Comentário</th>
              <th>Data</th>
              <th>Publicado Em</th> {/* Nova coluna para onde seria publicado */}
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id}>
                <td>{comment.id}</td>
                <td>{comment.conteudo}</td>
                <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                <td>
                  {comment.eventoId ? `Evento: ${comment.Evento.nome}` :
                   comment.forumId ? `Fórum: ${comment.Forum.titulo}` :
                   'Não publicado em nenhum lugar'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PendingCommentsPage;
