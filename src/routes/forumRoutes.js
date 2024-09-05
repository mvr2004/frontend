const express = require('express');
const forumController = require('../controllers/forumController');
const router = express.Router();

router.post('/create', forumController.createForum);
router.get('/list', forumController.getForums);
router.get('/list2', forumController.getForums2);
router.get('/list/:id', forumController.getForumById);

router.post('/comments', forumController.createComentario);
router.get('/list/:forumId/comments', forumController.getComentariosByForum);


// Novas rotas para ativar e eliminar fóruns
router.put('/activate/:id', forumController.activateForum); // Rota para ativar
router.delete('/delete/:id', forumController.deleteForum); // Rota para eliminar

router.get('/count-status', forumController.countForumsStatus);


module.exports = router;
