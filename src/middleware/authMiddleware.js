// Arquivo: middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Gera uma chave JWT secreta
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'seu-segredo-jwt';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.admin = decoded; // Armazena as informações do admin no objeto req
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = authMiddleware;
