// estabelecimentoService.js
const { Op, fn, col } = require('sequelize'); // Import required functions and objects from Sequelize
const sequelize = require('../configs/database'); // Import the Sequelize instance
const Estabelecimento = require('../models/Estabelecimento');
const Subarea = require('../models/Subarea');
const Area = require('../models/Area');
const Centro = require('../models/Centro');
const AvEstabelecimento = require('../models/AvaliacaoEstabelecimento');
const Comentario = require('../models/Comentario');


// Função para verificar se já existe um estabelecimento com o mesmo nome ou localização
const checkExistingEstablishment = async (nome, localizacao) => {
  const existingEstablishment = await Estabelecimento.findOne({
    where: {
      nome,
      localizacao
    }
  });
  return existingEstablishment;
};

// Função para criar um novo estabelecimento com upload de fotografia
const createEstablishment = async (data) => {
  const {
    nome,
    localizacao,
    contacto,
    descricao,
    pago,
    precoMedio,
    linkLocalizacao,
    subareaId,
    centroId,
    foto
  } = data;

  try {
    const establishment = await Estabelecimento.create({
      nome,
      localizacao,
      contacto,
      descricao,
      pago,
      precoMedio,
      linkLocalizacao,
      foto: `https://backend-9hij.onrender.com/uploads/${filename}`,
      subareaId,
      centroId
    });

    return establishment;
  } catch (error) {
    throw new Error(`Erro ao criar o estabelecimento: ${error.message}`);
  }
};

// Função para buscar todos os estabelecimentos
const getAllEstablishments = async () => {
  const establishments = await Estabelecimento.findAll({
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishments;
};

// Função para buscar estabelecimentos por nome
const getEstablishmentsByName = async (name) => {
  const establishments = await Estabelecimento.findAll({
    where: {
      nome: name
    },
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishments;
};

// Função para buscar estabelecimentos por áreas de interesse e centro com média de avaliações
const getEstablishmentsByAreasAndCentro = async (areaIdsArray, centroId) => {
    try {
        const subareas = await Subarea.findAll({
            where: {
                areaId: areaIdsArray
            }
        });

        const subareaIds = subareas.map(subarea => subarea.id);

        const whereClause = {
            subareaId: {
                [Op.in]: subareaIds
            }
        };

        if (centroId) {
            whereClause.centroId = centroId;
        }

        const establishments = await Estabelecimento.findAll({
            where: whereClause,
            include: [
                {
                    model: Subarea,
                    attributes: ['id', 'nomeSubarea'],
                    include: {
                        model: Area,
                        attributes: ['id', 'nomeArea'],
                    },
                },
                {
                    model: Centro,
                    attributes: ['id', 'centro'],
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt'] // Se você quiser excluir esses atributos
            }
        });

        return establishments;
    } catch (error) {
        throw new Error(`Erro ao buscar estabelecimentos por áreas de interesse e centro: ${error.message}`);
    }
};


// Função para buscar um estabelecimento pelo ID
const getEstablishmentById = async (id) => {
  const establishment = await Estabelecimento.findByPk(id, {
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
      include: {
        model: Area,
        attributes: ['id', 'nomeArea'],
      },
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishment;
};

// Função para buscar estabelecimentos por centro
const getEstablishmentsByCentro = async (centroId) => {
  try {
    const establishments = await Estabelecimento.findAll({
      where: { centroId }, // Filtro pelo centroId
      include: [{
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
      }, {
        model: Centro,
        attributes: ['id', 'centro'],
      }],
    });
    return establishments;
  } catch (error) {
    throw new Error(`Erro ao buscar estabelecimentos por centro: ${error.message}`);
  }
};

// Função para buscar estabelecimentos ativos por centro
const getActiveEstablishmentsByCentro = async (centroId) => {
  try {
    const establishments = await Estabelecimento.findAll({
      where: { centroId, ativo: true }, // Filtro pelo centroId e apenas os ativos
      include: [{
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
      }, {
        model: Centro,
        attributes: ['id', 'centro'],
      }],
    });
    return establishments;
  } catch (error) {
    throw new Error(`Erro ao buscar estabelecimentos ativos por centro: ${error.message}`);
  }
};

// Função para buscar estabelecimentos inativos por centro
const getInactiveEstablishmentsByCentro = async (centroId) => {
  try {
    const establishments = await Estabelecimento.findAll({
      where: { centroId, ativo: false }, // Filtro pelo centroId e apenas os inativos
      include: [{
        model: Subarea,
        attributes: ['id', 'nomeSubarea'],
      }, {
        model: Centro,
        attributes: ['id', 'centro'],
      }],
    });
    return establishments;
  } catch (error) {
    throw new Error(`Erro ao buscar estabelecimentos inativos por centro: ${error.message}`);
  }
};

module.exports = {
  checkExistingEstablishment,
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
  getEstablishmentsByCentro,
  getActiveEstablishmentsByCentro, 
  getInactiveEstablishmentsByCentro,
};
