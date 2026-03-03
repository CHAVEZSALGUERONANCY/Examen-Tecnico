const productoModel = require('../models/producto.model');

exports.getAll = async (req, res) => {
    try {
        const productos = await productoModel.getAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const producto = await productoModel.getById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.search = async (req, res) => {
    try {
        const { q, categoria } = req.query;
        const productos = await productoModel.search(q, categoria);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const existente = await productoModel.getBySku(req.body.sku);
        if (existente) {
            return res.status(400).json({ message: 'El SKU ya existe' });
        }
        
        const nuevoProducto = await productoModel.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const producto = await productoModel.update(req.params.id, req.body);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await productoModel.delete(req.params.id);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStock = async (req, res) => {
    try {
        const stock = await productoModel.getStockActual(req.params.id);
        res.json({ stock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};