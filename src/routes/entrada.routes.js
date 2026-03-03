const express = require('express');
const router = express.Router();
const entradaController = require('../controllers/entrada.controller');

router.get('/', entradaController.getAll);
router.get('/rango-fechas', entradaController.getByDateRange);
router.get('/:id', entradaController.getById);
router.get('/producto/:productoId', entradaController.getByProducto);
router.post('/', entradaController.create);

module.exports = router;