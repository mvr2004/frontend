const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

router.get('/:centroId/comentarios-publicados', comentarioController.getComentariosPublicadosDoCentro);
router.get('/:centroId/comentarios-por-publicar', comentarioController.getComentariosPorPublicarDoCentro);

// Verifique se essas funções estão corretamente definidas no controlador
router.get('/:id', comentarioController.getComentarioById);
router.post('/:id/like', comentarioController.likeComentario);
router.post('/:id/dislike', comentarioController.dislikeComentario);
router.post('/:id/denunciar', comentarioController.denunciarComentario);
router.patch('/:id/ativo', comentarioController.toggleComentarioAtivo);
router.post('/:id/ativar', comentarioController.ativarComentario);
router.delete('/:id', comentarioController.eliminarComentario);

// Nova rota para resetar as denúncias do comentário
router.patch('/:id/resetar-denuncias', comentarioController.resetarDenunciasComentario);

// Rotas para contagens de comentários
router.get('/:centroId/comentarios-ativos/count', comentarioController.countComentariosAtivos);
router.get('/:centroId/comentarios-inativos/count', comentarioController.countComentariosInativos);
router.get('/:centroId/denuncias/count', comentarioController.countDenunciasComentarios);


module.exports = router;
