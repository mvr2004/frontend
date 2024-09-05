// src/routes/estabelecimentoRoutes.js
const express = require('express');
const estabelecimentoController = require('../controllers/estabelecimentoController'); 
const avaliacaoEstabelecimentoController = require('../controllers/avaliacaoEstabelecimentoController');
const router = express.Router();
const upload = require('../configs/multer');


// Rota para criar um estabelecimento
router.post('/criarestab', upload.single('foto'), estabelecimentoController.createEstablishment);

// Rota para buscar todos os estabelecimentos
router.get('/list', estabelecimentoController.getAllEstablishments);

// Rota para buscar o estabelecimento pelo nome
router.get('/estabname', estabelecimentoController.getEstablishmentsByName);

// Rota para buscar estabelecimentos por uma ou várias áreas de interesse
router.get('/estabareaecemtrp', estabelecimentoController.getEstablishmentsByAreasAndCentro);


// Rota para buscar um estabelecimento pelo ID
router.get('/estab/:id', estabelecimentoController.getEstablishmentById);


// Rota para ativar um estabelecimento pelo ID
router.put('/ativar/:id', estabelecimentoController.activateEstablishment);



// Rota para criar uma avaliação de estabelecimento
router.post('/avaliacao', avaliacaoEstabelecimentoController.createEstabelecimentoReview);

// Rota para listar as avaliações de um estabelecimento
router.get('/avaliacao/:establishmentId', avaliacaoEstabelecimentoController.listEstabelecimentoReviews);

// Rota para calcular a média das avaliações de um estabelecimento e o número de avaliações
router.get('/avaliacao/media/:establishmentId', avaliacaoEstabelecimentoController.calculateEstabelecimentoAverageRating);


router.get('/centro/:centroId', estabelecimentoController.getEstablishmentsByCentro);

// Rota para buscar estabelecimentos ativos por centro
router.get('/centro/ativos/:centroId', estabelecimentoController.getActiveEstablishmentsByCentro);

// Rota para buscar estabelecimentos inativos por centro
router.get('/centro/inativos/:centroId', estabelecimentoController.getInactiveEstablishmentsByCentro);

// Rota para criar estabelecimentos diretamente ativos
router.post('/criarativo', upload.single('foto'), estabelecimentoController.createActiveEstablishment);

// Rota para apagar estabelecimento
router.delete('/apagar/:id', estabelecimentoController.deleteEstablishment);

// Rota para alterar um estabelecimento
router.put('/alterar/:id', estabelecimentoController.updateEstablishment);

// Rota para contar estabelecimentos ativos e inativos
router.get('/contar/ativos-inativos', estabelecimentoController.countActiveAndInactiveEstablishments);


module.exports = router;