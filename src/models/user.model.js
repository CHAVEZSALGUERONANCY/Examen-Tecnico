const { promisePool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = {
    async findByEmail(email) {
        const [rows] = await promisePool.query(
            'SELECT * FROM usuarios WHERE email = ? AND activo = true',
            [email]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await promisePool.query(
            'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ? AND activo = true',
            [id]
        );
        return rows[0];
    },

    async create(userData) {
        const { nombre, email, password, rol = 'usuario' } = userData;
        
        // Verificar si el email ya existe
        const existing = await this.findByEmail(email);
        if (existing) {
            throw new Error('El email ya está registrado');
        }

        // Hashear password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await promisePool.query(
            `INSERT INTO usuarios (nombre, email, password, rol) 
             VALUES (?, ?, ?, ?)`,
            [nombre, email, hashedPassword, rol]
        );

        return this.findById(result.insertId);
    },

    async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    },

    async setRememberToken(id, token) {
        await promisePool.query(
            'UPDATE usuarios SET remember_token = ? WHERE id = ?',
            [token, id]
        );
    },

    async getRememberToken(id) {
        const [rows] = await promisePool.query(
            'SELECT remember_token FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0]?.remember_token;
    },

    async clearRememberToken(id) {
        await promisePool.query(
            'UPDATE usuarios SET remember_token = NULL WHERE id = ?',
            [id]
        );
    },

    async validateRememberToken(token) {
        try {
            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET || 'secret_key'
            );
            
            const [rows] = await promisePool.query(
                'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND remember_token = ? AND activo = true',
                [decoded.id, token]
            );
            
            return rows[0] || null;
        } catch (error) {
            return null;
        }
    },

    async getAll() {
        const [rows] = await promisePool.query(
            'SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY created_at DESC'
        );
        return rows;
    },

    async update(id, userData) {
        const { nombre, email, rol, activo } = userData;
        
        await promisePool.query(
            `UPDATE usuarios 
             SET nombre = ?, email = ?, rol = ?, activo = ?
             WHERE id = ?`,
            [nombre, email, rol, activo, id]
        );

        return this.findById(id);
    },

    async delete(id) {
        // Soft delete y limpiar token
        await promisePool.query(
            'UPDATE usuarios SET activo = false, remember_token = NULL WHERE id = ?',
            [id]
        );
        return true;
    },

    async changePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await promisePool.query(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        // Opcional: limpiar token al cambiar password por seguridad
        await this.clearRememberToken(id);
        return true;
    }
};

module.exports = userModel;