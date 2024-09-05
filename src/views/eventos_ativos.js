import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

const ManagePublishedEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Estado para termo de pesquisa

  useEffect(() => {
    const fetchPublishedEvents = async () => {
      try {
        const response = await axios.get('https://backend-9hij.onrender.com/envt/list');
        // Filtrar apenas os eventos publicados
        const publishedEvents = response.data.events.filter(event => event.publicado === true);
        // Ordenar os eventos pela data
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

  const handleUpdateEvent = async () => {
    if (currentEvent && updatedData) {
      try {
        // Combine data e hora se for necessário
        if (updatedData.data && updatedData.hora) {
          const dataHora = new Date(`${updatedData.data}T${updatedData.hora}`);
          updatedData.data = dataHora.toISOString();  // Atualiza o campo data com a data e hora combinados
        }

        await axios.put(`https://backend-9hij.onrender.com/envt/updatev2/${currentEvent.id}`, updatedData);
        alert('O evento foi atualizado com sucesso!');
        setShowUpdateModal(false);
        setEvents(events.map(event => (event.id === currentEvent.id ? { ...event, ...updatedData } : event)));
      } catch (error) {
        alert('Erro ao atualizar o evento.');
      }
    }
  };

  const handleShowUpdateModal = (event) => {
    setCurrentEvent(event);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEventStatus = async (id, isActive) => {
    try {
      const updatedStatus = !isActive; // Alterna o status
      await axios.put(`https://backend-9hij.onrender.com/envt/toggle-active/${id}`, { ativo: updatedStatus });
      alert(`O evento foi ${updatedStatus ? 'ativado' : 'desativado'} com sucesso!`);
      // Atualiza o status na lista
      setEvents(events.map(event => (event.id === id ? { ...event, ativo: updatedStatus } : event)));
    } catch (error) {
      alert('Erro ao alterar o status do evento.');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`https://backend-9hij.onrender.com/envt/delete/${id}`);
      alert('O evento foi apagado com sucesso!');
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      alert('Erro ao apagar o evento.');
    }
  };

  // Filtrar eventos com base no termo de pesquisa
  const filteredEvents = events.filter((event) =>
    event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.Utilizador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.Utilizador.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação para os eventos filtrados
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Gerenciar Eventos Publicados</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {/* Barra de pesquisa */}
          <Form.Control
            type="text"
            placeholder="Pesquisar eventos..."
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table striped bordered hover responsive>
            <thead className="thead-dark">
              <tr>
                <th>Nome</th>
                <th>Data e Hora</th>
                <th>Utilizador</th>
                <th>Email</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.nome}</td>
                  <td>{new Date(event.data).toLocaleString()}</td>
                  <td>{event.Utilizador.nome}</td>
                  <td>{event.Utilizador.email}</td>
                  <td>{event.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleShowUpdateModal(event)}>Atualizar</Button>{' '}
                    <Button variant={event.ativo ? 'secondary' : 'success'} onClick={() => toggleEventStatus(event.id, event.ativo)}>
                      {event.ativo ? 'Desativar' : 'Ativar'}
                    </Button>{' '}
                    <Button variant="danger" onClick={() => deleteEvent(event.id)}>Apagar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {[...Array(Math.ceil(filteredEvents.length / eventsPerPage)).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Atualizar Evento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {currentEvent && (
                <Form>
                  <Form.Group controlId="formEventName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome do evento"
                      name="nome"
                      defaultValue={currentEvent.nome}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEventDate">
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                      type="date"
                      name="data"
                      defaultValue={new Date(currentEvent.data).toISOString().split('T')[0]}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEventTime">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      type="time"
                      name="hora"
                      defaultValue={new Date(currentEvent.data).toTimeString().substring(0, 5)}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateModal}>
                Fechar
              </Button>
              <Button variant="primary" onClick={handleUpdateEvent}>
                Atualizar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default ManagePublishedEvents;
