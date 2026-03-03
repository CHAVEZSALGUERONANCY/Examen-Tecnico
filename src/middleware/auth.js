const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: 'No autorizado - Token no proporcionado' 
            });
        }

        // Verificar token
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'secret_key'
        );

        // Buscar usuario
        const user = await userModel.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ 
                message: 'No autorizado - Usuario no encontrado' 
            });
        }

        // Añadir usuario a la request
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'No autorizado - Token inválido' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'No autorizado - Token expirado' 
            });
        }
        
        console.error('Error en auth middleware:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Middleware para verificar rol de admin
const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ 
            message: 'Acceso denegado - Se requiere rol de administrador' 
        });
    }
    next();
};

module.exports = { authMiddleware, isAdmin };