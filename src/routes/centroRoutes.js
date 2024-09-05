const express = require('express');
const router = express.Router();
const { listarCentros, listarCentros1, criarCentro, listarDistritos, toggleCentroStatus, editarCentro } = require('../controllers/centroController');

// Rota para listar centros
router.get('/list', listarCentros);

// Rota para listar centros com a função listarCentros1
router.get('/list1', listarCentros1);

// Rota para criar um novo centro
router.post('/create', criarCentro);

// Rota para listar distritos
router.get('/distritos', listarDistritos);

// Rota para alternar o status de um centro (ativar/desativar)
router.patch('/toggle/:id', toggleCentroStatus);

// Rota para editar um centro
router.put('/edit/:id', editarCentro);

module.exports = router;
