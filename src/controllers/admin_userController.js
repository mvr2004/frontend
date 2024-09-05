const { Op } = require('sequelize');
const User = require('../models/Utilizador');
const Centro = require('../models/Centro');
const bcrypt = require('bcrypt');

const userController = {};

// Função para adicionar um novo utilizador
userController.addUser = async (req, res) => {
  try {
    const { nome, email, password, centroId, fotoUrl } = req.body;

    const defaultFotoUrl = 'https://backend-ai2-proj.onrender.com/uploads/profile.jpg';
    const foto = fotoUrl || defaultFotoUrl;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    const centro = await Centro.findByPk(centroId);
    if (!centro) {
      return res.status(404).json({ message: 'Centro não encontrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nome, email, password: hashedPassword, fotoUrl: foto, centroId });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar adicionar o utilizador', error });
  }
};

// Função para atualizar um utilizador
userController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password, centroId, Ativo, notas, fotoUrl } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.nome = nome;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.centroId = centroId;
    user.Ativo = Ativo;
    user.notas = notas;
    user.fotoUrl = fotoUrl;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o utilizador', error });
  }
};

// Função para listar todos os utilizadores com filtros e pesquisa
userController.listUsers = async (req, res) => {
  try {
    const { search, centroId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [
        { nome: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { id: search }
      ];
    }

    if (centroId) {
      whereConditions.centroId = centroId;
    }

    const users = await User.findAll({
      where: whereConditions,
      include: Centro,
      limit,
      offset
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar os utilizadores', error });
  }
};

// Função para buscar utilizadores por nome, ID ou email (mantida para compatibilidade)
userController.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const searchQuery = search.toLowerCase();

    let users;
    if (!isNaN(searchQuery)) {
      users = await User.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${searchQuery}%` } },
            { email: { [Op.iLike]: `%${searchQuery}%` } },
            { id: searchQuery }
          ]
        },
        include: Centro
      });
    } else {
      users = await User.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${searchQuery}%` } },
            { email: { [Op.iLike]: `%${searchQuery}%` } }
          ]
        },
        include: Centro
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o utilizador', error });
  }
};

// Função para filtrar utilizadores por estado ativo ou inativo
userController.filterUsers = async (req, res) => {
  try {
    const { status, search, centroId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const isActive = status === 'ativo';

    const whereConditions = {
      Ativo: isActive
    };

    if (search) {
      whereConditions[Op.or] = [
        { nome: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { id: search }
      ];
    }

    if (centroId) {
      whereConditions.centroId = centroId;
    }

    const users = await User.findAll({
      where: whereConditions,
      include: Centro,
      limit,
      offset
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao filtrar os utilizadores', error });
  }
};

// Função para filtrar utilizadores por centroId sem paginação
userController.filterUsersByCentro = async (req, res) => {
  const { centroId } = req.params;

  try {
    const users = await User.findAll({
      where: { centroId },
      include: [{ model: Centro, attributes: ['centro'] }]
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Função para deletar (inativar) um utilizador
userController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const deletedUser = await User.destroy({
      where: { id }
    });

    if (deletedUser === 0) {
      user.Ativo = false;
      await user.save();
      return res.status(200).json({ message: 'Usuário inativado com sucesso' });
    }

    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar excluir ou inativar o utilizador', error });
  }
};

// Função para contar utilizadores totais, ativos e inativos
userController.countUsers = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { Ativo: true } });
    const inactiveUsers = await User.count({ where: { Ativo: false } });

    res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contar os utilizadores', error });
  }
};

// Exporta o controlador para ser usado nas rotas
module.exports = userController;
