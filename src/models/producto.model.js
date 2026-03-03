const { promisePool } = require('../config/db');

class ProductoModel {
    async getAll(activo = true) {
        const [rows] = await promisePool.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.activo = ?
            ORDER BY p.nombre
        `, [activo]);
        return rows;
    }

    async getById(id) {
        const [rows] = await promisePool.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    async getBySku(sku) {
        const [rows] = await promisePool.query('SELECT * FROM productos WHERE sku = ?', [sku]);
        return rows[0];
    }

    async search(term, categoriaId = null) {
        let query = `
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.activo = true
        `;
        const params = [];

        if (term) {
            query += ' AND (p.nombre LIKE ? OR p.sku LIKE ?)';
            params.push(`%${term}%`, `%${term}%`);
        }

        if (categoriaId) {
            query += ' AND p.categoria_id = ?';
            params.push(categoriaId);
        }

        query += ' ORDER BY p.nombre';
        
        const [rows] = await promisePool.query(query, params);
        return rows;
    }

    async create(producto) {
        const { nombre, sku, descripcion, categoria_id, precio_unitario, unidad_medida, stock_minimo } = producto;
        const [result] = await promisePool.query(
            `INSERT INTO productos 
            (nombre, sku, descripcion, categoria_id, precio_unitario, unidad_medida, stock_minimo) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, sku, descripcion, categoria_id, precio_unitario, unidad_medida, stock_minimo || 0]
        );
        return this.getById(result.insertId);
    }

    async update(id, producto) {
        const { nombre, descripcion, categoria_id, precio_unitario, unidad_medida, stock_minimo } = producto;
        await promisePool.query(
            `UPDATE productos 
            SET nombre = ?, descripcion = ?, categoria_id = ?, precio_unitario = ?, 
                unidad_medida = ?, stock_minimo = ?
            WHERE id = ?`,
            [nombre, descripcion, categoria_id, precio_unitario, unidad_medida, stock_minimo, id]
        );
        return this.getById(id);
    }

    async delete(id) {
        await promisePool.query('UPDATE productos SET activo = false WHERE id = ?', [id]);
        return true;
    }

    async getStockActual(id) {
        const [entradas] = await promisePool.query(
            'SELECT SUM(cantidad) as total FROM entradas WHERE producto_id = ?',
            [id]
        );
        const [salidas] = await promisePool.query(
            'SELECT SUM(cantidad) as total FROM salidas WHERE producto_id = ?',
            [id]
        );

        const totalEntradas = entradas[0].total || 0;
        const totalSalidas = salidas[0].total || 0;
        
        return totalEntradas - totalSalidas;
    }

    async getProductosConStock() {
        const productos = await this.getAll();
        const productosConStock = await Promise.all(
            productos.map(async (producto) => {
                const stock = await this.getStockActual(producto.id);
                return {
                    ...producto,
                    stock_actual: stock,
                    stock_bajo: stock <= (producto.stock_minimo || 0)
                };
            })
        );
        return productosConStock;
    }
}

module.exports = new ProductoModel();