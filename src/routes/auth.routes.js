const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

// GET /api/auth/login → aviso (login es POST)
router.get('/login', (req, res) => {
    res.status(405).json({
        message: 'El login debe hacerse con POST',
        method: 'POST',
        url: '/api/auth/login',
        body: { email: 'string', password: 'string' }
    });
});
router.post('/login', authController.login);

// GET /api/auth/register → aviso (register es POST)
router.get('/register', (req, res) => {
    res.status(405).json({
        message: 'El registro debe hacerse con POST',
        method: 'POST',
        url: '/api/auth/register',
        body: { nombre: 'string', email: 'string', password: 'string' }
    });
});
router.post('/register', authController.register);
router.get('/verify', authController.verifyToken);

// Ruta protegida de ejemplo
router.get('/profile', authMiddleware, async (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;