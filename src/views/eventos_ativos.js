import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Pagination } from 'react-bootstrap';

const PublishedEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5); // Número de eventos por página
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublishedEvents = async () => {
      try {
        const response = await axios.get('https://backend-9hij.onrender.com/envt/list');
        const publishedEvents = response.data.events.filter(event => event.publicado);
        const sortedEvents = publishedEvents.sort((a, b) => new Date(b.data) - new Date(a.data));
        setEvents(sortedEvents);
      } catch (error) {
        setError('Erro ao buscar eventos publicados.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedEvents();
  }, []);

  // Lógica de paginação
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Eventos Publicados</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="thead-dark">
              <tr>
                <th>Nome</th>
                <th>Data</th>
                <th>Usuário</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.nome}</td>
                  <td>{new Date(event.data).toLocaleDateString()}</td>
                  <td>{event.Utilizador.nome}</td>
                  <td>{event.Utilizador.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {[...Array(Math.ceil(events.length / eventsPerPage)).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default PublishedEvents;
