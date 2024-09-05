// services/grupoService.js

const Grupo = require('../models/Grupo');

// Serviço para criar um novo grupo
const createGroup = async (req, res) => {
  const { nome, descricao, areaId } = req.body;

  const grupo = await Grupo.create({ nome, descricao, areaId });
  res.status(201).json({ message: 'Grupo criado com sucesso!', grupo });
};

// Serviço para buscar todos os grupos
const getAllGroups = async () => {
  return await Grupo.findAll();
};

// Serviço para buscar grupo por ID
const getGroupById = async (id) => {
  return await Grupo.findByPk(id);
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
};
