// controllers/eventoController.js

const eventService = require('../services/eventoService');
const moment = require('moment');
const Evento = require('../models/Evento');
const Grupo = require('../models/Grupo');
const Utilizador = require('../models/Utilizador');
const Comentario = require('../models/Comentario');



const getEventsByGroup = async (req, res, next) => {
  try {
    const { grupoId } = req.params;

    const grupo = await Grupo.findByPk(grupoId);
    if (!grupo) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }

    const events = await grupo.getEventos(); 
    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos por grupo:', error);
    next(error);
  }
};


// Controlador para criar um novo evento
const createEvent = async (req, res, next) => {
  try {
    await eventService.createEvent(req, res, next);
  } catch (error) {
    console.error('Erro no controlador de evento:', error);
    next(error);
  }
};

// Controlador para buscar todos os eventos
const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar todos os eventos:', error);
    next(error);
  }
};


// Controlador para buscar eventos por centro e ordenar por área de interesse e data
const getEventsByCentro = async (req, res, next) => {
  const { centroId } = req.query;
  try {
    const events = await eventService.getEventsByCentro(centroId);
    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos por centro:', error);
    next(error);
  }
};

// Controlador para buscar um evento pelo ID
const getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }
    res.json({ event });
  } catch (error) {
    console.error('Erro ao buscar evento por ID:', error);
    next(error);
  }
};

// Controlador para buscar eventos por usuário
const getEventsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const events = await eventService.getEventsByUserId(userId);
    res.json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos por usuário:', error);
    next(error);
  }
};

// Controlador para criar um comentário
const createComentario = async (req, res, next) => {
  try {
    const { conteudo, eventoId, utilizadorId } = req.body;
    const comentario = await eventService.createComentario({ conteudo, eventoId, utilizadorId });
    res.status(201).json({ comentario });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    next(error);
  }
};

// Controlador para buscar comentários por evento
const getComentariosByEvento = async (req, res, next) => {
  const { eventoId } = req.params; // Extraindo o eventoId dos parâmetros da requisição
  try {
    const comentarios = await Comentario.findAll({
      where: { 
        eventoId,
        ativo: true // Buscar apenas comentários ativos
      },
      include: [
        { 
          model: Utilizador, 
          attributes: ['id', 'nome'] 
        }
      ],
      attributes: ['id', 'conteudo', 'likes', 'dislikes', 'createdAt'], // Inclui createdAt
      order: [['createdAt', 'DESC']] // Ordena pela data de criação em ordem decrescente
    });
    res.json({ comentarios });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventData = req.body;

    // Busca o evento pelo ID
    const event = await Evento.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Verifica se o evento já foi publicado
    if (event.publicado) {
      return res.status(403).json({ error: 'Eventos publicados não podem ser alterados.' });
    }

    // Atualiza o evento com os novos dados
    await event.update(eventData);
    res.status(200).json({ message: 'Evento atualizado com sucesso.', event });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    next(error);
  }
};



// Controlador para publicar um evento
const publicarEvento = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Evento.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Atualiza o status de publicado para true
    event.publicado = true;
	event.ativo = true;
    await event.save();

    res.status(200).json({ message: 'Evento publicado com sucesso.', event });
  } catch (error) {
    console.error('Erro ao publicar evento:', error);
    next(error);
  }
};


// Controlador para apagar um evento
const deleteEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Evento.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Apaga o evento
    await event.destroy();
    res.status(200).json({ message: 'Evento apagado com sucesso.' });
  } catch (error) {
    console.error('Erro ao apagar evento:', error);
    next(error);
  }
};


const activateOrDeactivateEvent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Evento.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Alterna o status ativo do evento
    event.ativo = !event.ativo;
    await event.save();

    res.status(200).json({ message: `Evento ${event.ativo ? 'ativado' : 'desativado'} com sucesso.`, event });
  } catch (error) {
    console.error('Erro ao ativar/desativar evento:', error);
    next(error);
  }
};

const updateEventv2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventData = req.body;

    // Busca o evento pelo ID
    const event = await Evento.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Atualiza o evento com os novos dados
    await event.update(eventData);
    res.status(200).json({ message: 'Evento atualizado com sucesso.', event });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    next(error);
  }
};

const getUnpublishedEvents = async (req, res, next) => {
  try {
    const unpublishedEvents = await Evento.findAll({
      where: {
        publicado: false
      }
    });
    res.json({ unpublishedEvents });
  } catch (error) {
    console.error('Erro ao buscar eventos não publicados:', error);
    next(error);
  }
};

const getPublishedEvents = async (req, res, next) => {
  try {
    const publishedEvents = await Evento.findAll({
      where: {
        publicado: true
      }
    });
    res.json({ publishedEvents });
  } catch (error) {
    console.error('Erro ao buscar eventos publicados:', error);
    next(error);
  }
};

const getActiveEvents = async (req, res, next) => {
  try {
    const activeEvents = await Evento.findAll({
      where: {
        ativo: true
      }
    });
    res.json({ activeEvents });
  } catch (error) {
    console.error('Erro ao buscar eventos ativos:', error);
    next(error);
  }
};


module.exports = {
  createEvent,
  getAllEvents,
  getEventsByCentro,
  getEventById,
   getEventsByUserId, 
   getEventsByGroup,
  createComentario,
  getComentariosByEvento,
  updateEvent,
  publicarEvento,
  deleteEvent, 
  activateOrDeactivateEvent, 
  updateEventv2,
  getUnpublishedEvents,
  getPublishedEvents,
  getActiveEvents,
  };