require('dotenv').config();
const app = require('./src/app');
const { createTables } = require('./src/config/initTables');

const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Crear tablas antes de iniciar el servidor
        await createTables();
        
        app.listen(PORT, () => {
            console.log(` Servidor corriendo en puerto ${PORT} API disponible en: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();