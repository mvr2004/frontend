// src/routes/genericRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../configs/multer'); // Importação do uploadConfig

router.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send('Arquivo genérico enviado com sucesso!');
});

module.exports = router;
