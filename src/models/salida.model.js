const { promisePool } = require('../config/db');

class SalidaModel {
    async getAll() {
        const [rows] = await promisePool.query(`
            SELECT s.*, p.nombre as producto_nombre, p.sku 
            FROM salidas s
            JOIN productos p ON s.producto_id = p.id
            ORDER BY s.fecha DESC, s.created_at DESC
        `);
        return rows;
    }

    async getById(id) {
        const [rows] = await promisePool.query(`
            SELECT s.*, p.nombre as producto_nombre, p.sku 
            FROM salidas s
            JOIN productos p ON s.producto_id = p.id
            WHERE s.id = ?
        `, [id]);
        return rows[0];
    }

    async create(salida) {
        const { producto_id, cantidad, fecha, motivo } = salida;
        
        const productoModel = require('./producto.model');
        const stockActual = await productoModel.getStockActual(producto_id);
        
        if (stockActual < cantidad) {
            throw new Error('Stock insuficiente para realizar la salida');
        }

        const [result] = await promisePool.query(
            'INSERT INTO salidas (producto_id, cantidad, fecha, motivo) VALUES (?, ?, ?, ?)',
            [producto_id, cantidad, fecha, motivo]
        );
        return this.getById(result.insertId);
    }

    async getByProducto(productoId) {
        const [rows] = await promisePool.query(
            'SELECT * FROM salidas WHERE producto_id = ? ORDER BY fecha DESC',
            [productoId]
        );
        return rows;
    }

    async getByMotivo(motivo) {
        const [rows] = await promisePool.query(`
            SELECT s.*, p.nombre as producto_nombre, p.sku 
            FROM salidas s
            JOIN productos p ON s.producto_id = p.id
            WHERE s.motivo = ?
            ORDER BY s.fecha DESC
        `, [motivo]);
        return rows;
    }
}

module.exports = new SalidaModel();