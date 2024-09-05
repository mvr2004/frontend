const express = require('express');
const albumController = require('../controllers/albumController');
const upload = require('../configs/multer');
const router = express.Router();

router.post('/create', albumController.createAlbum);
router.get('/list', albumController.getAlbums);
router.get('/list/forum/:forumId', albumController.getAlbumsByForum);  // Nova rota para listar álbuns por fórum

router.post('/upload/:albumId', upload.array('photos', 10), albumController.uploadPhotos);

// Nova rota para listar fotos de um álbum específico
router.get('/photos/:albumId', albumController.getPhotosByAlbum);

module.exports = router;
