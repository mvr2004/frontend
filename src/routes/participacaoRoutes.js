// routes/participacaoRoutes.js

const express = require('express');
const router = express.Router();
const participacaoController = require('../controllers/participacaoController');

router.post('/add', participacaoController.addUserToEvent);
router.post('/remove', participacaoController.removeUserFromEvent);
router.get('/event/:eventoId/users', participacaoController.getUsersByEvent);
router.get('/user/:utilizadorId/events', participacaoController.getEventsByUser);

module.exports = router;
