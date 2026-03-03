const entradaModel = require('../models/entrada.model');

exports.getAll = async (req, res) => {
    try {
        const entradas = await entradaModel.getAll();
        res.json(entradas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const entrada = await entradaModel.getById(req.params.id);
        if (!entrada) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }
        res.json(entrada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByProducto = async (req, res) => {
    try {
        const entradas = await entradaModel.getByProducto(req.params.productoId);
        res.json(entradas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByDateRange = async (req, res) => {
    try {
        const { inicio, fin } = req.query;
        const entradas = await entradaModel.getByDateRange(inicio, fin);
        res.json(entradas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const nuevaEntrada = await entradaModel.create(req.body);
        res.status(201).json(nuevaEntrada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};