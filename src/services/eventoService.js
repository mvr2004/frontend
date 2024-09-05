// services/eventoService.js
const Evento = require('../models/Evento');
const Subarea = require('../models/Subarea');
const Utilizador = require('../models/Utilizador');
const Centro = require('../models/Centro');
const Area = require('../models/Area');
const Grupo = require('../models/Grupo');
const Comentario = require('../models/Comentario');
const moment = require('moment');

const createEvent = async (req, res, next) => {
  try {
    const { 
      nome, 
      localizacao, 
      data, 
      hora, 
      descricao, 
      subareaId, 
      utilizadorId, 
      centroId, 
      grupoId, 
      maxParticipantes, 
      linkLocalizacao,
      linkComunicacao  // Novo campo adicionado
    } = req.body;

    // Verificar se o utilizador existe
    if (utilizadorId) {
      const userExists = await Utilizador.findByPk(utilizadorId);
      if (!userExists) {
        return res.status(400).json({ error: 'Utilizador não encontrado.' });
      }
    }

    // Verificar se o grupo existe
    if (grupoId) {
      const groupExists = await Grupo.findByPk(grupoId);
      if (!groupExists) {
        return res.status(400).json({ error: 'Grupo não encontrado.' });
      }
    }

    // Certificar-se de que ou um utilizadorId ou grupoId foi fornecido
    if (!utilizadorId && !grupoId) {
      return res.status(400).json({ error: 'É necessário fornecer um utilizadorId ou grupoId.' });
    }

    // Formatando data e hora usando moment
    const formattedDate = moment(data, 'YYYY-MM-DD').toDate();
    const formattedTime = moment(hora, 'HH:mm').format('HH:mm');

    // Criar o evento no banco de dados
    const event = await Evento.create({
      nome,
      localizacao,
      data: formattedDate,
      hora: formattedTime,
      descricao,
      subareaId,
      utilizadorId,
      centroId,
      grupoId, 
      maxParticipantes,
      linkLocalizacao,
      linkComunicacao  // Salvando o link de comunicação
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error('Erro no serviço de evento:', error);
    next(error);
  }
};




// Função para buscar todos os eventos
const getAllEvents = async () => {
  const events = await Evento.findAll({
    include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
        include: [
          {
            model: Area,
            attributes: ['id', 'nomeArea', 'icon'],  // Pega o nome da área
          }
        ]
      },
      {
        model: Utilizador,
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      },
      {
        model: Grupo,  // Inclui o grupo associado ao evento
        attributes: ['id', 'nome', 'descricao']
      }
    ],
  });
  return events;
};


// Função para buscar eventos por centro e ordenar por área de interesse e data
const getEventsByCentro = async (centroId) => {
  const events = await Evento.findAll({
    where: {
      centroId: centroId
    },
    include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
        include: [
          {
            model: Area,
            attributes: ['id', 'nomeArea', 'icon'],  // Pega o nome da área
          }
        ]
      },
      {
        model: Utilizador,
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      },
      {
        model: Grupo,  // Inclui o grupo associado ao evento
        attributes: ['id', 'nome', 'descricao']
      }
    ],
    order: [
      [Subarea, 'nomeSubarea', 'ASC'],
      ['data', 'DESC']
    ]
  });
  return events;
};


// Função para buscar um evento pelo ID
const getEventById = async (id) => {
  const event = await Evento.findByPk(id, {
    include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
        include: [
          {
            model: Area,
            attributes: ['id', 'nomeArea', 'icon'],
          }
        ]
      },
      {
        model: Utilizador,
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      },
      {
        model: Grupo,  // Inclui o grupo associado ao evento
        attributes: ['id', 'nome', 'descricao']
      }
    ],
  });
  return event;
};

const getEventsByUserId = async (userId) => {
  try {
    const events = await Evento.findAll({ 
      where: { utilizadorId: userId },
      include: [
      {
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
        include: [
          {
            model: Area,
            attributes: ['id', 'nomeArea', 'icon'],
          }
        ]
      },
      {
        model: Utilizador,
        attributes: ['id', 'nome', 'email', 'fotoUrl'],
      },
      {
        model: Centro,
        attributes: ['id', 'centro'],
      },
      {
        model: Grupo,  // Inclui o grupo associado ao evento
        attributes: ['id', 'nome', 'descricao']
      }
    ],
    }); 
    return events;
  } catch (error) {
    console.error('Erro ao buscar eventos por usuário:', error);
    throw error;
  }
};


// Função para criar um comentário
const createComentario = async (data) => {
  const { conteudo, eventoId, utilizadorId } = data;
  try {
    const comentario = await Comentario.create({
      conteudo,
      eventoId,
      utilizadorId,
      ativo: false  // Comentário será inativo por padrão
    });
    return comentario;
  } catch (error) {
    throw new Error(`Erro ao criar comentário: ${error.message}`);
  }
};

// Função para buscar comentários por evento
const getComentariosByEvento = async (eventoId) => {
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
      attributes: ['id', 'conteudo', 'likes', 'dislikes'] // Inclui likes e dislikes
    });
    return comentarios;
  } catch (error) {
    throw new Error(`Erro ao buscar comentários: ${error.message}`);
  }
};


module.exports = {
  createEvent,
  getAllEvents,
  getEventsByCentro,
  getEventById,
  getEventsByUserId, 
   createComentario,
  getComentariosByEvento,
};
