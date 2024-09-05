const express = require('express');
const router = express.Router();
const formularioController = require('../controllers/formularioController');

// Criar formulário
router.post('/create', formularioController.createFormulario);

// Atualizar estado do formulário
router.put('/formularios/:formularioId/status', formularioController.updateFormularioStatus);

// Criar campo do formulário (só permitido se o formulário não for publicado)
router.post('/formularios/:formularioId/campos', formularioController.createCampoFormulario);

// Publicar formulário
router.put('/formularios/:formularioId/publicar', formularioController.publishFormulario);

// Submeter resposta ao formulário
router.post('/formularios/respostas', formularioController.submitFormularioResponse);

// Obter respostas por formulário
router.get('/formularios/:formularioId/respostas', formularioController.getResponsesByFormulario);

// Obter formulários respondidos por um utilizador
router.get('/utilizadores/:utilizadorId/formularios-respondidos', formularioController.getFormulariosRespondidos);

// Obter respostas de um formulário por utilizador e evento
router.get('/utilizadores/:utilizadorId/eventos/:eventoId/formularios/:formularioId/respostas', formularioController.getFormularioResponsesByUserAndEvent);

// Obter formulários respondidos de um evento por um utilizador
router.get('/utilizadores/:utilizadorId/eventos/:eventoId/formularios-respondidos', formularioController.getFormulariosRespondidosPorEvento);

// Obter formulários de um evento
router.get('/eventos/:eventoId/formularios', formularioController.getFormulariosByEvento);


// Atualizar campo do formulário
router.put('/campos/:campoFormularioId', formularioController.updateCampoFormulario);

// Obter todos os campos de um formulário
router.get('/formularios/:formularioId/campos', formularioController.getCamposByFormulario);


module.exports = router;
