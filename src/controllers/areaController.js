const UserArea = require('../models/UtilizadorArea');
const Area = require('../models/Area');
const Forum = require('../models/Forum');
const Subarea = require('../models/Subarea');
const User = require('../models/Utilizador');

// Controller para consultar todas as áreas
const getAllAreas = async (req, res, next) => {
  try {
    const areas = await Area.findAll();
    res.json({ areas });
  } catch (error) {
    console.error('Erro ao buscar todas as áreas:', error);
    next(error);
  }
};

// Controller para consultar as subáreas de uma área específica
const getSubareasByAreaId = async (req, res, next) => {
  const { areaId } = req.params;
  try {
    const subareas = await Subarea.findAll({
      where: { areaId: areaId },
      include: [{ model: Area, attributes: ['id', 'nomeArea'] }],
    });
    res.json({ subareas });
  } catch (error) {
    console.error('Erro ao buscar subáreas por área:', error);
    next(error);
  }
};

// Controller para associar um usuário a uma área
const associateUserWithArea = async (req, res, next) => {
  try {
    const { userId, areaId } = req.body;
    const association = await UserArea.create({ userId, areaId });
    res.status(201).json({ association });
  } catch (error) {
    console.error('Erro ao associar usuário com área:', error);
    next(error);
  }
};

// Controller para criar uma nova área e um fórum associado
const createArea = async (req, res) => {
  try {
    const { nomeArea } = req.body;
    let iconUrl = null;

    // Verifica se há um arquivo enviado
    if (req.file) {
      const filename = req.file.filename;
      iconUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;
    }

    // Verifica se a área já existe
    const existingArea = await Area.findOne({ where: { nomeArea } });
    if (existingArea) {
      return res.status(409).json({ message: 'A área já existe' });
    }

    // Criação da nova área
    const newArea = await Area.create({ nomeArea, icon: iconUrl });

    // Criação de um fórum associado para a nova área
    const forum = await Forum.create({
      titulo: `Fórum de ${newArea.nomeArea}`,
      descricao: `Discussões relacionadas à área de ${newArea.nomeArea}`,
      areaId: newArea.id,
      subareaId: null, 
    });

    res.status(201).json({ newArea, forum });
  } catch (error) {
    console.error('Erro ao criar a área e fórum associado:', error);
    res.status(500).json({ message: 'Erro ao criar a área e fórum associado.', error });
  }
};

// Controller para criar uma nova subárea
const createSubarea = async (req, res) => {
  try {
    const { nomeSubarea, areaId } = req.body;

    // Verifica se a subárea já existe
    const existingSubarea = await Subarea.findOne({ where: { nomeSubarea, areaId } });
    if (existingSubarea) {
      return res.status(409).json({ message: 'A subárea já existe' });
    }

    // Criação da nova subárea
    const newSubarea = await Subarea.create({ nomeSubarea, areaId });
    res.status(201).json(newSubarea);
  } catch (error) {
    console.error('Erro ao criar subárea:', error);
    res.status(500).json({ message: 'Erro ao criar a subárea', error });
  }
};

// Controller para adicionar uma área de interesse a um usuário
const addUserArea = async (req, res) => {
  const { userId, areaIds } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Remove todas as áreas de interesse atuais do usuário
    await UserArea.destroy({ where: { userId } });

    // Adiciona as novas áreas de interesse
    const newUserAreas = areaIds.map(areaId => ({ userId, areaId }));
    await UserArea.bulkCreate(newUserAreas);

    return res.status(201).json({ message: 'Áreas de interesse atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar áreas de interesse do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Controller para listar áreas de interesse de um usuário
const listUserAreas = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Area, through: UserArea }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const areas = user.Areas.map(area => ({
      id: area.id,
      nomeArea: area.nomeArea
    }));

    return res.status(200).json(areas);
  } catch (error) {
    console.error('Erro ao listar áreas de interesse do usuário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


// Controller para editar uma área
const editArea = async (req, res) => {
  try {
    const { id } = req.params;  // ID da área a ser editada
    const { nomeArea } = req.body;
    let iconUrl = null;

    // Verifica se há um novo arquivo enviado
    if (req.file) {
      const filename = req.file.filename;
      iconUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;
    }

    // Atualiza a área existente
    const area = await Area.findByPk(id);
    if (!area) {
      return res.status(404).json({ message: 'Área não encontrada' });
    }

    area.nomeArea = nomeArea || area.nomeArea;
    if (iconUrl) area.icon = iconUrl;

    await area.save();  // Salva as alterações no banco de dados

    res.status(200).json({ message: 'Área atualizada com sucesso', area });
  } catch (error) {
    console.error('Erro ao editar área:', error);
    res.status(500).json({ message: 'Erro ao editar a área', error });
  }
};


// Controller para editar uma subárea
const editSubarea = async (req, res) => {
  try {
    const { id } = req.params;  // ID da subárea a ser editada
    const { nomeSubarea, areaId } = req.body;

    // Atualiza a subárea existente
    const subarea = await Subarea.findByPk(id);
    if (!subarea) {
      return res.status(404).json({ message: 'Subárea não encontrada' });
    }

    subarea.nomeSubarea = nomeSubarea || subarea.nomeSubarea;
    subarea.areaId = areaId || subarea.areaId;

    await subarea.save();  // Salva as alterações no banco de dados

    res.status(200).json({ message: 'Subárea atualizada com sucesso', subarea });
  } catch (error) {
    console.error('Erro ao editar subárea:', error);
    res.status(500).json({ message: 'Erro ao editar a subárea', error });
  }
};

const getAllSubareas = async (req, res, next) => {
  const { areaId, page = 1, limit = 10 } = req.query;

  try {
    const whereClause = {};
    if (areaId) {
      whereClause.areaId = areaId;
    }

    const subareas = await Subarea.findAndCountAll({
      where: whereClause,
      include: [{ model: Area, attributes: ['id', 'nomeArea'] }],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['nomeSubarea', 'ASC']], // Ordena alfabética
    });

    const totalPages = Math.ceil(subareas.count / limit);

    res.json({
      subareas: subareas.rows,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Erro ao buscar todas as subáreas:', error);
    next(error);
  }
};





// Exporta todos os controladores
module.exports = {
  getAllAreas,
  getSubareasByAreaId,
  associateUserWithArea,
  createArea,
  createSubarea,
  addUserArea,
  listUserAreas,
  editArea,
  editSubarea,
  getAllSubareas,
};
