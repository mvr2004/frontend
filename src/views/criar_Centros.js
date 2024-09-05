import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriarCentros = () => {
  const [centro, setCentro] = useState('');
  const [distrito, setDistrito] = useState('');
  const [distritos, setDistritos] = useState([]);
  const [adminNome, setAdminNome] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistritos = async () => {
      try {
        const response = await axios.get('https://backend-9hij.onrender.com/centros/distritos');
        setDistritos(response.data);
      } catch (error) {
        console.error('Erro ao buscar distritos:', error);
        setErrorMessage('Erro ao carregar a lista de distritos');
      }
    };

    fetchDistritos();
  }, []);

  // Atualizar o nome do administrador automaticamente com "Admin" no início
  useEffect(() => {
    if (centro) {
      setAdminNome(`Admin ${centro}`);
    } else {
      setAdminNome('');
    }
  }, [centro]);

  const handleCreateCentro = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (adminPassword !== confirmAdminPassword) {
      setErrorMessage('As palavras-passe não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://backend-9hij.onrender.com/centros/create', {
        centro,
        distrito,
        adminNome,
        adminPassword,
      });
      setSuccessMessage(response.data.message + "! A ser redirecionado...");
      setTimeout(() => navigate('/centers'), 2000); // Redireciona após 2 segundos
    } catch (error) {
      console.error('Erro ao criar o centro:', error);
      setErrorMessage(error.response?.data?.message || 'Erro ao criar o centro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Criar um novo Centro</h1>
      <Card>
        <Card.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleCreateCentro}>
            <Form.Group controlId="formCentro">
              <Form.Label>Nome do Centro</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduza o nome do centro"
                value={centro}
                onChange={(e) => setCentro(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDistrito" className="mt-3">
              <Form.Label>Distrito</Form.Label>
              <Form.Control
                as="select"
                value={distrito}
                onChange={(e) => setDistrito(e.target.value)}
                required
              >
                <option value="">Selecione um distrito</option>
                {distritos.map((distrito) => (
                  <option key={distrito.name} value={distrito.name}>
                    {distrito.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAdminNome" className="mt-3">
              <Form.Label>Nome do Administrador</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do administrador"
                value={adminNome}
                onChange={(e) => setAdminNome(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAdminPassword" className="mt-3">
              <Form.Label>Palavra-passe do Administrador</Form.Label>
              <Form.Control
                type="password"
                placeholder="Introduza a palavra-passe"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmAdminPassword" className="mt-3">
              <Form.Label>Confirme a Palavra-passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme a palavra-passe"
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Centro'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CriarCentros;
