const jwtDecode = require('jwt-decode'); // Adiciona esta linha
const Forum = require('../models/Forum');
const Comentario = require('../models/Comentario');
const Area = require('../models/Area');
const Subarea = require('../models/Subarea');
const Utilizador = require('../models/Utilizador');
const Centro = require('../models/Centro'); // Importando o modelo Centro
const { Op } = require('sequelize');

exports.createForum = async (req, res) => {
  try {
    const { titulo, descricao, regras, areaId, subareaId, centroId } = req.body;
    const forum = await Forum.create({ titulo, descricao, regras, areaId, subareaId, centroId });
    res.status(201).json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fórum.' });
  }
};

exports.getForums = async (req, res) => {
  try {
    console.log('Buscando todos os fóruns...');
    const forums = await Forum.findAll({
      where: { ativo: true }, // Filtra apenas os fóruns ativos
      include: [
        {
          model: Subarea,
          attributes: ['id', 'nomeSubarea'],
          required: false,
          include: [
            {
              model: Area,
              attributes: ['id', 'nomeArea', 'icon'],
            }
          ]
        },
        {
          model: Area,
          attributes: ['id', 'nomeArea', 'icon'],
          required: false,
        },
        {
          model: Centro,
          attributes: ['id', 'centro'],
          required: false,
        },
      ],
    });

    console.log('Fóruns encontrados:', forums);
    res.json(forums);
  } catch (error) {
    console.error('Erro ao buscar fóruns:', error);
    res.status(500).json({ error: 'Erro ao buscar fóruns.' });
  }
};

exports.getForumById = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findOne({
      where: { id, ativo: true }, // Filtra por id e apenas fóruns ativos
      include: [
        {
          model: Subarea,
          attributes: ['id', 'nomeSubarea'],
          required: false,
          include: [
            {
              model: Area,
              attributes: ['id', 'nomeArea', 'icon'],
            }
          ]
        },
        {
          model: Area,
          attributes: ['id', 'nomeArea', 'icon'],
          required: false,
        },
        {
          model: Centro,
          attributes: ['id', 'centro'],
          required: false,
        },
      ],
    });

    if (forum) {
      res.json(forum);
    } else {
      res.status(404).json({ error: 'Fórum não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fórum.' });
  }
};


exports.createComentario = async (req, res) => {
  try {
    const { conteudo, forumId, utilizadorId } = req.body;
    const comentario = await Comentario.create({
      conteudo,
      forumId,
      utilizadorId,
      likes: 0,
      dislikes: 0
    });
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar comentário.' });
  }
};

exports.getComentariosByForum = async (req, res) => {
  try {
    const { forumId } = req.params;
    console.log(`Buscando comentários para o fórum com ID: ${forumId}`);

    const comentarios = await Comentario.findAll({
      where: { 
        forumId,
        ativo: true
      },
      include: [{ 
        model: Utilizador, 
        attributes: ['id', 'nome'] 
      }],
      attributes: ['id', 'conteudo', 'likes', 'dislikes', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    console.log('Comentários encontrados:', comentarios);
    res.json(comentarios);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
};
exports.getForums2 = async (req, res) => {
  try {
    const centroId = req.query.centroId; // Obtém o ID do centro diretamente dos parâmetros

    console.log('Centro ID:', centroId);

    const whereClause = {
      ativo: true, // Filtra apenas os fóruns ativos
      [Op.or]: [
        { centroId: centroId }, // Filtros pelos fóruns que têm o centroId especificado
        { centroId: null } // Filtros pelos fóruns que não têm um centroId associado
      ]
    };

    const forums = await Forum.findAll({
      where: whereClause,
      include: [
        {
          model: Subarea,
          attributes: ['id', 'nomeSubarea'],
          required: false,
          include: [
            {
              model: Area,
              attributes: ['id', 'nomeArea', 'icon'],
            }
          ]
        },
        {
          model: Area,
          attributes: ['id', 'nomeArea', 'icon'],
          required: false,
        },
        {
          model: Centro,
          attributes: ['id', 'centro'],
          required: false,
        },
      ],
      order: [['ativo', 'DESC'], ['titulo', 'ASC']] // Ordena pelo campo "ativo" (ativos primeiro) e depois pelo título
    });

    console.log('Forums found:', forums);
    res.json(forums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({ error: 'Erro ao buscar fóruns.' });
  }
};


// Adiciona uma rota para ativar um fórum
exports.activateForum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findByPk(id);

    if (forum) {
      forum.ativo = true; // Define o fórum como ativo
      await forum.save();
      res.status(200).json(forum);
    } else {
      res.status(404).json({ error: 'Fórum não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ativar fórum.' });
  }
};

// Adiciona uma rota para eliminar um fórum
exports.deleteForum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findByPk(id);

    if (forum) {
      await forum.destroy(); // Remove o fórum
      res.status(200).json({ message: 'Fórum eliminado com sucesso.' });
    } else {
      res.status(404).json({ error: 'Fórum não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao eliminar fórum.' });
  }
};


exports.countForumsStatus = async (req, res) => {
  try {
    // Conta a quantidade de fóruns ativos e inativos
    const activeCount = await Forum.count({ where: { ativo: true } });
    const inactiveCount = await Forum.count({ where: { ativo: false } });

    // Envia o resultado
    res.status(200).json({
      ativos: activeCount,
      inativos: inactiveCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao contar os fóruns.' });
  }
};
