const { promisePool } = require('../config/db');

class EntradaModel {
    async getAll() {
        const [rows] = await promisePool.query(`
            SELECT e.*, p.nombre as producto_nombre, p.sku 
            FROM entradas e
            JOIN productos p ON e.producto_id = p.id
            ORDER BY e.fecha DESC, e.created_at DESC
        `);
        return rows;
    }

    async getById(id) {
        const [rows] = await promisePool.query(`
            SELECT e.*, p.nombre as producto_nombre, p.sku 
            FROM entradas e
            JOIN productos p ON e.producto_id = p.id
            WHERE e.id = ?
        `, [id]);
        return rows[0];
    }

    async create(entrada) {
        const { producto_id, cantidad, fecha, nota } = entrada;
        const [result] = await promisePool.query(
            'INSERT INTO entradas (producto_id, cantidad, fecha, nota) VALUES (?, ?, ?, ?)',
            [producto_id, cantidad, fecha, nota]
        );
        return this.getById(result.insertId);
    }

    async getByProducto(productoId) {
        const [rows] = await promisePool.query(
            'SELECT * FROM entradas WHERE producto_id = ? ORDER BY fecha DESC',
            [productoId]
        );
        return rows;
    }

    async getByDateRange(fechaInicio, fechaFin) {
        const [rows] = await promisePool.query(`
            SELECT e.*, p.nombre as producto_nombre, p.sku 
            FROM entradas e
            JOIN productos p ON e.producto_id = p.id
            WHERE e.fecha BETWEEN ? AND ?
            ORDER BY e.fecha DESC
        `, [fechaInicio, fechaFin]);
        return rows;
    }
}

module.exports = new EntradaModel();