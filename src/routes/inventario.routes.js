const express = require('express');
const router = express.Router();
const productoModel = require('../models/producto.model');

router.get('/stock', async (req, res) => {
    try {
        const { categoria, busqueda } = req.query;
        
        let productos = await productoModel.getProductosConStock();
        
        if (categoria) {
            productos = productos.filter(p => p.categoria_id == categoria);
        }
        
        if (busqueda) {
            const term = busqueda.toLowerCase();
            productos = productos.filter(p => 
                p.nombre.toLowerCase().includes(term) || 
                p.sku.toLowerCase().includes(term)
            );
        }
        
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/stock-bajo', async (req, res) => {
    try {
        const productos = await productoModel.getProductosConStock();
        const stockBajo = productos.filter(p => p.stock_bajo);
        res.json(stockBajo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;