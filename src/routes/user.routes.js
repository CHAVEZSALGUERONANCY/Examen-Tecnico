const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth');

// Todas las rutas de usuarios requieren autenticación
router.use(authMiddleware);

// Rutas para administradores
router.get('/', isAdmin, userController.getAll);
router.get('/:id', isAdmin, userController.getById);
router.put('/:id', isAdmin, userController.update);
router.delete('/:id', isAdmin, userController.delete);

// Ruta para el perfil propio (cualquier usuario autenticado)
router.get('/profile/me', userController.getProfile);

module.exports = router;