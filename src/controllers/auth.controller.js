const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const authController = {
    // Login
    login: async (req, res) => {
        try {
            // Aceptar email y password por body (POST) o por query (GET)
            const email = req.body?.email ?? req.query?.email;
            const password = req.body?.password ?? req.query?.password;

            // Validar campos
            if (!email || !password) {
                return res.status(400).json({ 
                    message: 'Email y password son requeridos' 
                });
            }

            // Buscar usuario
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ 
                    message: 'Credenciales inválidas' 
                });
            }

            // Verificar password
            const isValid = await userModel.comparePassword(password, user.password);
            if (!isValid) {
                return res.status(401).json({ 
                    message: 'Credenciales inválidas' 
                });
            }

            // Crear token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    rol: user.rol 
                },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: process.env.JWT_EXPIRES || '24h' }
            );

            // Guardar token en el usuario (remember_token)
            await userModel.setRememberToken(user.id, token);

            // Responder sin enviar password ni remember_token
            const { password: _, remember_token: __, ...userWithoutSensitive } = user;
            
            res.json({
                message: 'Login exitoso',
                token,
                user: userWithoutSensitive
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Register
    register: async (req, res) => {
        try {
            // Aceptar por body (POST) o por query (GET)
            const nombre = req.body?.nombre ?? req.query?.nombre;
            const email = req.body?.email ?? req.query?.email;
            const password = req.body?.password ?? req.query?.password;

            // Validar campos
            if (!nombre || !email || !password) {
                return res.status(400).json({ 
                    message: 'Todos los campos son requeridos' 
                });
            }

            // Crear usuario
            const newUser = await userModel.create({
                nombre,
                email,
                password,
                rol: 'usuario'
            });

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: newUser
            });

        } catch (error) {
            if (error.message === 'El email ya está registrado') {
                return res.status(400).json({ message: error.message });
            }
            console.error('Error en registro:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Verify Token
    verifyToken: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ valid: false });
            }

            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET || 'secret_key'
            );

            const user = await userModel.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({ valid: false });
            }

            res.json({ 
                valid: true, 
                user 
            });

        } catch (error) {
            res.status(401).json({ valid: false });
        }
    },

    // Logout
    logout: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (token && req.user) {
                // Limpiar remember_token
                await userModel.clearRememberToken(req.user.id);
            }

            res.json({ message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Refresh Token
    refreshToken: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Token no proporcionado' });
            }

            // Validar el remember_token
            const user = await userModel.validateRememberToken(token);
            
            if (!user) {
                return res.status(401).json({ message: 'Token inválido o expirado' });
            }

            // Crear nuevo token
            const newToken = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    rol: user.rol 
                },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: process.env.JWT_EXPIRES || '24h' }
            );

            // Actualizar token en base de datos
            await userModel.setRememberToken(user.id, newToken);

            res.json({
                message: 'Token refrescado exitosamente',
                token: newToken,
                user
            });

        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
};

module.exports = authController;