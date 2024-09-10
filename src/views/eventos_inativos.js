import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';

const ManageUnpublishedEvents = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

useEffect(() => {
  const idCentro = localStorage.getItem('idCentro');

  if (!idCentro) {
    setError('ID do centro não encontrado.');
    return;
  }

  const fetchUnpublishedEvents = async () => {
    try {
      const response = await axios.get('https://backend-9hij.onrender.com/envt/list');
      const unpublishedEvents = response.data.events
        .filter(event => event.publicado === false && event.Utilizador.idCentro === idCentro); // Filtra pelo centro id
      const sortedEvents = unpublishedEvents.sort((a, b) => new Date(b.data) - new Date(a.data));
      setEvents(sortedEvents);
    } catch (error) {
      setError('Erro ao buscar eventos não publicados.');
    } finally {
      setLoading(false);
    }
  };
  fetchUnpublishedEvents();
}, []);


const handleUpdateEvent = async () => {
  if (currentEvent && updatedData) {
    try {
      // Combine data e hora se for necessário
      if (updatedData.data && updatedData.hora) {
        const dataHora = new Date(`${updatedData.data}T${updatedData.hora}`);
        updatedData.data = dataHora.toISOString();  // Atualiza o campo data com a data e hora combinados
      }

      await axios.put(`https://backend-9hij.onrender.com/envt/update/${currentEvent.id}`, updatedData);
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
    // Se o campo for "hora", adiciona os segundos
    const updatedValue = name === 'hora' ? `${value}:00` : value;
    setUpdatedData(prevData => ({
      ...prevData,
      [name]: updatedValue
    }));
  };

  const publishEvent = async (id) => {
    try {
      await axios.put(`https://backend-9hij.onrender.com/envt/publish/${id}`);
      alert('O evento foi publicado!');
      // Remover o evento da lista após a publicação
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      alert('Erro ao publicar o evento.');
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

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Gerenciar Eventos Não Publicados</h1>
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
                <th>Data e Hora</th>
                <th>Utilizador</th>
                <th>Email</th>
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
                  <td>
                    <Button variant="success" onClick={() => publishEvent(event.id)}>Publicar</Button>
                    <Button variant="warning" onClick={() => handleShowUpdateModal(event)}>Atualizar</Button>
                    <Button variant="danger" onClick={() => deleteEvent(event.id)}>Apagar</Button>
                  </td>
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
                      defaultValue={new Date(currentEvent.data).toTimeString().split(' ')[0].substring(0, 5)}
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

export default ManageUnpublishedEvents;
