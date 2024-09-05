// src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController'); // Ensure this path is correct
const upload = require('../configs/multer');
const router = express.Router();

router.post('/register', userController.register);
router.get('/data', userController.getData);
router.post('/confirmEmail', userController.confirmEmail);
router.post('/updatePassword', userController.updatePassword);
router.post('/updateCentro', userController.updateCentro);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.put('/updateProfile/:id', upload.single('photo'), userController.updateUserProfile);
router.get('/getUserData/:userId', userController.getUserData);
router.get('/areas/:userId', userController.getUserAreas);
router.post('/updateUserAreas', userController.updateUserAreas);
// Nova rota para listar eventos e estabelecimentos para o utilizador
router.get('/eventos-e-estabelecimentos/:userId', userController.listarEventosEEstabelecimentos);

module.exports = router;
