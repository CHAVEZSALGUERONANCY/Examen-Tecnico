const { promisePool } = require('../config/db');

class CategoriaModel {
    async getAll() {
        const [rows] = await promisePool.query('SELECT * FROM categorias ORDER BY nombre');
        return rows;
    }

    async getById(id) {
        const [rows] = await promisePool.query('SELECT * FROM categorias WHERE id = ?', [id]);
        return rows[0];
    }

    async create(categoria) {
        const { nombre, descripcion } = categoria;
        const [result] = await promisePool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return { id: result.insertId, ...categoria };
    }

    async update(id, categoria) {
        const { nombre, descripcion } = categoria;
        await promisePool.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );
        return this.getById(id);
    }

    async delete(id) {
        // Verificar si hay productos usando esta categoría
        const [productos] = await promisePool.query(
            'SELECT COUNT(*) as count FROM productos WHERE categoria_id = ? AND activo = true',
            [id]
        );
        
        if (productos[0].count > 0) {
            throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
        }

        await promisePool.query('DELETE FROM categorias WHERE id = ?', [id]);
        return true;
    }
}

module.exports = new CategoriaModel();