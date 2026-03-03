const express = require('express');
const router = express.Router();
const salidaController = require('../controllers/salida.controller');

router.get('/', salidaController.getAll);
router.get('/motivo/:motivo', salidaController.getByMotivo);
router.get('/:id', salidaController.getById);
router.get('/producto/:productoId', salidaController.getByProducto);
router.post('/', salidaController.create);

module.exports = router;