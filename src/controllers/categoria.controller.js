const categoriaModel = require('../models/categoria.model');

exports.getAll = async (req, res) => {
    try {
        const categorias = await categoriaModel.getAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const categoria = await categoriaModel.getById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const nuevaCategoria = await categoriaModel.create(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const categoria = await categoriaModel.update(req.params.id, req.body);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await categoriaModel.delete(req.params.id);
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};