const express = require('express');
const router = express.Router();
const utilizadorGrupoController = require('../controllers/utilizadorGrupoController');

// Adicionar utilizador a grupo
router.post('/add', utilizadorGrupoController.addUserToGroup);

// Remover utilizador de grupo
router.delete('/remove', utilizadorGrupoController.removeUserFromGroup);

// Listar grupos de um utilizador
router.get('/user/:utilizadorId/groups', utilizadorGrupoController.listGroupsForUser);

// Listar utilizadores de um grupo
router.get('/group/:grupoId/users', utilizadorGrupoController.listUsersForGroup);

module.exports = router;
