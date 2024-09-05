// src/routes/authRoutes.js
const express = require('express');
const passport = require('../configs/passport');
const { login, googleLogin,facebookLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/login/google', googleLogin);
router.post('/login/facebook', facebookLogin);

// Rotas para autenticação via Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: 'Login bem-sucedido', user: req.user });
  }
);

module.exports = router;
