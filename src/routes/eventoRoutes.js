const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventoController');

// Rota para criar um evento
router.post('/create', eventController.createEvent);

// Rota para listar todos os eventos
router.get('/list', eventController.getAllEvents);

// Rota para buscar eventos por centro
router.get('/searchByCentro', eventController.getEventsByCentro);

// Rota para buscar um evento por ID
router.get('/:id', eventController.getEventById);

// Rota para buscar eventos por usuário
router.get('/byUser/:userId', eventController.getEventsByUserId);

// Rota para buscar eventos por grupo
router.get('/grupo/:grupoId', eventController.getEventsByGroup);

// Rota para criar um comentário
router.post('/comments', eventController.createComentario);

// Rota para buscar comentários por evento
router.get('/:eventoId/comments', eventController.getComentariosByEvento);


// Rota para atualizar um evento
router.put('/update2/:id', eventController.updateEvent);

// Rota para apagar um evento
router.delete('/delete/:id', eventController.deleteEvent);

// Rota para ativar/desativar um evento
router.put('/toggle-active/:id', eventController.activateOrDeactivateEvent);

// Rota para publicar e ativar um evento
router.put('/publish/:id', eventController.publicarEvento);


// Rota para listar eventos não publicados
router.get('/listunpublished', eventController.getUnpublishedEvents);

// Rota para listar eventos publicados
router.get('/listpublished', eventController.getPublishedEvents);

// Rota para listar eventos ativos
router.get('/listactive', eventController.getActiveEvents);

module.exports = router;
