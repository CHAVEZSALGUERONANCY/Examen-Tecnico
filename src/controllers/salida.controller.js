const salidaModel = require('../models/salida.model');

exports.getAll = async (req, res) => {
    try {
        const salidas = await salidaModel.getAll();
        res.json(salidas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const salida = await salidaModel.getById(req.params.id);
        if (!salida) {
            return res.status(404).json({ message: 'Salida no encontrada' });
        }
        res.json(salida);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByProducto = async (req, res) => {
    try {
        const salidas = await salidaModel.getByProducto(req.params.productoId);
        res.json(salidas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByMotivo = async (req, res) => {
    try {
        const salidas = await salidaModel.getByMotivo(req.params.motivo);
        res.json(salidas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const nuevaSalida = await salidaModel.create(req.body);
        res.status(201).json(nuevaSalida);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};