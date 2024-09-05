const express = require('express');
const router = express.Router();
const admin_userController = require('../controllers/admin_userController');  // Importação correta do controlador
const upload = require('../configs/multer');

// Definições de rotas
router.post('/add', upload.single('foto'), admin_userController.addUser);
router.put('/update/:id', upload.single('foto'), admin_userController.updateUser);
router.get('/list', admin_userController.listUsers);
router.get('/search', admin_userController.searchUsers);
router.get('/filter', admin_userController.filterUsers);
router.get('/filterByCentro/:centroId', admin_userController.filterUsersByCentro);
router.delete('/delete/:id', admin_userController.deleteUser);
router.get('/count', admin_userController.countUsers);

module.exports = router;
