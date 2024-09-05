// services/participacaoService.js

const ParticipacaoEvento = require('../models/UtilizadorEventos');
const Utilizador = require('../models/Utilizador');
const Evento = require('../models/Evento');
//Adicionados
const Centro = require('../models/Centro');
const Area = require('../models/Area');
const Subarea = require('../models/Subarea');
const Grupo = require('../models/Grupo');

// Função para adicionar um utilizador a um evento
const addUserToEvent = async (utilizadorId, eventoId) => {
    try {
        // Verifica se o evento existe
        const evento = await Evento.findByPk(eventoId);
        if (!evento) {
            throw new Error('Evento não encontrado.');
        }

        // Verifica se o evento tem um limite de participantes
        if (evento.maxParticipantes !== null) {
            const currentParticipants = await ParticipacaoEvento.count({ where: { eventoId } });
            if (currentParticipants >= evento.maxParticipantes) {
                throw new Error('O número máximo de participantes para este evento já foi atingido.');
            }
        }

        // Verifica se o utilizador existe
        const user = await Utilizador.findByPk(utilizadorId);
        if (!user) {
            throw new Error('Usuário não encontrado com o ID fornecido.');
        }

        // Cria a participação no evento
        const participacao = await ParticipacaoEvento.create({ utilizadorId, eventoId });
        return participacao;
    } catch (error) {
        throw new Error('Erro ao adicionar utilizador ao evento: ' + error.message);
    }
};


// Função para remover um utilizador de um evento
const removeUserFromEvent = async (utilizadorId, eventoId) => {
    try {
        await ParticipacaoEvento.destroy({
            where: {
                utilizadorId,
                eventoId
            }
        });
    } catch (error) {
        throw new Error('Erro ao remover utilizador do evento: ' + error.message);
    }
};

// Função para obter todos os utilizador de um evento
const getUsersByEvent = async (eventoId) => {
    try {
        const utilizadores = await Utilizador.findAll({
            include: [{
                model: Evento,
                where: { id: eventoId },
                through: { attributes: [] }
            }]
        });
        return utilizadores;
    } catch (error) {
        throw new Error('Erro ao obter utilizador do evento: ' + error.message);
    }
};

// Função para obter todos os eventos de um utilizador
const getEventsByUser = async (utilizadorId) => {
    try {
        // Verifica se o utilizador existe
        const user = await Utilizador.findByPk(utilizadorId);
        if (!user) {
            throw new Error('Usuário não encontrado com o ID fornecido.');
        }

        // Busca todos os eventos associados ao utilizador através da tabela de participação
        const participacoes = await ParticipacaoEvento.findAll({
            where: { utilizadorId }
        });

        const eventosIds = participacoes.map(participacao => participacao.eventoId);

        // Obtém todos os eventos com base nos IDs coletados
        const eventos = await Evento.findAll({
            where: {
                id: eventosIds
            },
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

        return eventos;
    } catch (error) {
        throw new Error('Erro ao obter eventos do utilizador: ' + error.message);
    }
};

module.exports = {
    addUserToEvent,
    removeUserFromEvent,
    getUsersByEvent,
    getEventsByUser
};
