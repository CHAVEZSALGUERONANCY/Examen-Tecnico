const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');
const entradaRoutes = require('./routes/entrada.routes');
const salidaRoutes = require('./routes/salida.routes');
const inventarioRoutes = require('./routes/inventario.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log de todas las peticiones (para ver qué URL llega y por qué da 404)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Aceptar /api/auth/login y /api/auth/login/ (quitar barra final)
app.use((req, res, next) => {
    if (req.url.length > 1 && req.url.endsWith('/') && !req.url.includes('?')) {
        req.url = req.url.slice(0, -1);
    } else if (req.url.includes('?') && req.url.replace(/\?.*$/, '').endsWith('/')) {
        const [path, qs] = req.url.split('?');
        req.url = path.replace(/\/+$/, '') + (qs ? '?' + qs : '');
    }
    next();
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API examen técnico',
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
    });
});

// GET /api (evita 404 al abrir http://localhost:3000/api)
app.get('/api', (req, res) => {
    res.json({
        message: 'API disponible',
        endpoints: {
            health: 'GET /api/health',
            auth: 'POST /api/auth/login | POST /api/auth/register',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            entradas: '/api/entradas',
            salidas: '/api/salidas',
            inventario: '/api/inventario'
        }
    });
});

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/usuarios', userRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/entradas', entradaRoutes);
app.use('/api/salidas', salidaRoutes);
app.use('/api/inventario', inventarioRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date()
    });
});

// Manejador de errores 404
app.use((req, res) => {
    console.log(`  -> 404: no existe ruta para ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

module.exports = app;