// routes/grupoRoutes.js

const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');

router.post('/create', grupoController.createGroup);
router.get('/list', grupoController.getAllGroups);
router.get('/:id', grupoController.getGroupById);

module.exports = router;
