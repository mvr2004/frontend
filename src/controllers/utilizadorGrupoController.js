const UtilizadorGrupo = require('../models/UtilizadorGrupo');
const Utilizador = require('../models/Utilizador');
const Grupo = require('../models/Grupo');

// Adicionar um utilizador a um grupo
const addUserToGroup = async (req, res, next) => {
  try {
    const { utilizadorId, grupoId } = req.body;

    // Verificar se o utilizador e o grupo existem
    const utilizador = await Utilizador.findByPk(utilizadorId);
    const grupo = await Grupo.findByPk(grupoId);

    if (!utilizador || !grupo) {
      return res.status(404).json({ error: 'Utilizador ou Grupo não encontrado.' });
    }

    // Criar associação
    await UtilizadorGrupo.create({ utilizadorId, grupoId });

    res.status(201).json({ message: 'Utilizador adicionado ao grupo com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar utilizador ao grupo:', error);
    next(error);
  }
};

// Remover um utilizador de um grupo
const removeUserFromGroup = async (req, res, next) => {
  try {
    const { utilizadorId, grupoId } = req.body;

    // Verificar se a associação existe
    const association = await UtilizadorGrupo.findOne({
      where: { utilizadorId, grupoId },
    });

    if (!association) {
      return res.status(404).json({ error: 'Associação não encontrada.' });
    }

    // Remover a associação
    await association.destroy();

    res.status(200).json({ message: 'Utilizador removido do grupo com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover utilizador do grupo:', error);
    next(error);
  }
};

// Listar grupos de um utilizador
const listGroupsForUser = async (req, res, next) => {
  try {
    const { utilizadorId } = req.params;

    // Buscar utilizador com os grupos associados
    const utilizador = await Utilizador.findByPk(utilizadorId, {
      include: Grupo,
    });

    if (!utilizador) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    res.json({ grupos: utilizador.Grupos });
  } catch (error) {
    console.error('Erro ao listar grupos do utilizador:', error);
    next(error);
  }
};

// Listar utilizadores de um grupo
const listUsersForGroup = async (req, res, next) => {
  try {
    const { grupoId } = req.params;

    // Buscar grupo com os utilizadores associados
    const grupo = await Grupo.findByPk(grupoId, {
      include: Utilizador,
    });

    if (!grupo) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }

    res.json({ utilizadores: grupo.Utilizadors });
  } catch (error) {
    console.error('Erro ao listar utilizadores do grupo:', error);
    next(error);
  }
};

module.exports = {
  addUserToGroup,
  removeUserFromGroup,
  listGroupsForUser,
  listUsersForGroup,
};
