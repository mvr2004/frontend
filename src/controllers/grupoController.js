// controllers/grupoController.js

const grupoService = require('../services/grupoService');

// Controlador para criar um novo grupo
const createGroup = async (req, res, next) => {
  try {
    await grupoService.createGroup(req, res, next);
  } catch (error) {
    console.error('Erro no controlador de grupo:', error);
    next(error);
  }
};

// Controlador para buscar todos os grupos
const getAllGroups = async (req, res, next) => {
  try {
    const groups = await grupoService.getAllGroups();
    res.json({ groups });
  } catch (error) {
    console.error('Erro ao buscar todos os grupos:', error);
    next(error);
  }
};

// Controlador para buscar grupo por ID
const getGroupById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const group = await grupoService.getGroupById(id);
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }
    res.json({ group });
  } catch (error) {
    console.error('Erro ao buscar grupo por ID:', error);
    next(error);
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
};
