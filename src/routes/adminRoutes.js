const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rota para criar um novo Admin
router.post('/create', adminController.createAdmin);


// Rota de login
router.post('/login', adminController.loginAdmin);

module.exports = router;
