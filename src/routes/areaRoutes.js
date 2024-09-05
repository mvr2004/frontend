const express = require('express');
const areaController = require('../controllers/areaController');
const router = express.Router();
const upload = require('../configs/multer');

// Rota para buscar todas as áreas
router.get('/list', areaController.getAllAreas);

// Rota para associar utilizador a área
router.post('/associate', areaController.associateUserWithArea);

// Rota para adicionar área de interesse a um usuário
router.post('/add-user-area', areaController.addUserArea);

// Rota para buscar as subáreas de uma área específica
router.get('/areas/:areaId/subareas', areaController.getSubareasByAreaId);

// Rota para criar uma nova área
router.post('/create_areas', upload.single('icon'), areaController.createArea);

// Rota para criar uma nova subárea
router.post('/create_subareas', areaController.createSubarea);


// Rota para listar áreas de interesse de um usuário
router.get('/list-user-areas/:userId', areaController.listUserAreas);


// Rota para editar uma área
router.put('/edit_area/:id', upload.single('icon'), areaController.editArea);


// Rota para editar uma subárea
router.put('/edit_subarea/:id', areaController.editSubarea);

// Rota para listar todas as subáreas
router.get('/list-subareas', areaController.getAllSubareas);



module.exports = router;
