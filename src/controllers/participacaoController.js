// controllers/participacaoController.js

const participacaoService = require('../services/participacaoService');

// Controlador para adicionar um utilizador a um evento
const addUserToEvent = async (req, res, next) => {
    try {
        const { utilizadorId, eventoId } = req.body;
        const participacao = await participacaoService.addUserToEvent(utilizadorId, eventoId);
        res.status(201).json({ participacao });
    } catch (error) {
        console.error('Erro ao adicionar utilizador ao evento:', error);
        res.status(400).json({ error: error.message });
        next(error);
    }
};

// Controlador para remover um utilizador de um evento
const removeUserFromEvent = async (req, res, next) => {
    try {
        const { utilizadorId, eventoId } = req.body;
        await participacaoService.removeUserFromEvent(utilizadorId, eventoId);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover utilizador do evento:', error);
        next(error);
    }
};

// Controlador para obter todos os utilizador de um evento
const getUsersByEvent = async (req, res, next) => {
    try {
        const { eventoId } = req.params;
        const utilizadores = await participacaoService.getUsersByEvent(eventoId);
        res.json({ utilizadores });
    } catch (error) {
        console.error('Erro ao obter utilizador do evento:', error);
        next(error);
    }
};

// Controlador para obter todos os eventos de um utilizador
const getEventsByUser = async (req, res, next) => {
    try {
        const { utilizadorId } = req.params;
        const eventos = await participacaoService.getEventsByUser(utilizadorId);
        res.json({ eventos });
    } catch (error) {
        console.error('Erro ao obter eventos do utilizador:', error);
        next(error);
    }
};


module.exports = {
    addUserToEvent,
    removeUserFromEvent,
    getUsersByEvent,
    getEventsByUser
};
