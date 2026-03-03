const userModel = require('../models/user.model');

const userController = {
    // Obtener todos los usuarios (solo admin)
    getAll: async (req, res) => {
        try {
            const users = await userModel.getAll();
            res.json(users);
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    },

    // Obtener usuario por ID (solo admin)
    getById: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({ message: 'Error al obtener usuario' });
        }
    },

    // Obtener perfil del usuario autenticado
    getProfile: async (req, res) => {
        try {
            // req.user viene del middleware authMiddleware
            const user = await userModel.findById(req.user.id);
            res.json(user);
        } catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({ message: 'Error al obtener perfil' });
        }
    },

    // Actualizar usuario (solo admin)
    update: async (req, res) => {
        try {
            const user = await userModel.update(req.params.id, req.body);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    },

    // Eliminar usuario (soft delete) (solo admin)
    delete: async (req, res) => {
        try {
            await userModel.delete(req.params.id);
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    }
};

module.exports = userController;