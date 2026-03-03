const { promisePool } = require('./db');
const bcrypt = require('bcrypt');

const createTables = async () => {
    try {
        console.log('Iniciando creación de tablas...');

        // Tabla de usuarios (para autenticación)
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                rol ENUM('admin', 'usuario') DEFAULT 'usuario',
                activo BOOLEAN DEFAULT true,
                remember_token VARCHAR(500) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_rol (rol)
            )
        `);
        console.log(' Tabla "usuarios" verificada/creada');

        // Añadir columna remember_token si la tabla ya existía sin ella
        try {
            await promisePool.query(
                'ALTER TABLE usuarios ADD COLUMN remember_token VARCHAR(500) NULL'
            );
            console.log(' Columna remember_token añadida a usuarios');
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') throw err;
        }

        // Insertar usuario admin si no existe
        await insertAdminUser();

        // Tabla de categorías
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                descripcion TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla "categorias" verificada/creada');

        // Tabla de productos
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(200) NOT NULL,
                sku VARCHAR(50) NOT NULL UNIQUE,
                descripcion TEXT,
                categoria_id INT,
                precio_unitario DECIMAL(10,2) NOT NULL,
                unidad_medida VARCHAR(20) NOT NULL,
                stock_minimo INT DEFAULT 0,
                activo BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
                INDEX idx_sku (sku),
                INDEX idx_categoria (categoria_id)
            )
        `);
        console.log(' Tabla "productos" verificada/creada');

        // Tabla de entradas
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS entradas (
                id INT PRIMARY KEY AUTO_INCREMENT,
                producto_id INT NOT NULL,
                cantidad INT NOT NULL CHECK (cantidad > 0),
                fecha DATE NOT NULL,
                nota TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id),
                INDEX idx_producto (producto_id),
                INDEX idx_fecha (fecha)
            )
        `);
        console.log('Tabla "entradas" verificada/creada');

        // Tabla de salidas
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS salidas (
                id INT PRIMARY KEY AUTO_INCREMENT,
                producto_id INT NOT NULL,
                cantidad INT NOT NULL CHECK (cantidad > 0),
                fecha DATE NOT NULL,
                motivo ENUM('venta', 'merma', 'devolucion', 'otro') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id),
                INDEX idx_producto (producto_id),
                INDEX idx_fecha (fecha)
            )
        `);
        console.log(' Tabla "salidas" verificada/creada');

        console.log(' Todas las tablas creadas/verificadas correctamente');
    } catch (error) {
        console.error(' Error creando tablas:', error);
        throw error;
    }
};

const insertAdminUser = async () => {
    try {        
        // Verificar si ya existe un admin
        const [admins] = await promisePool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            ['admin@inventario.com']
        );

        if (admins.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await promisePool.query(
                `INSERT INTO usuarios (nombre, email, password, rol) 
                 VALUES (?, ?, ?, ?)`,
                ['Administrador', 'admin@inventario.com', hashedPassword, 'admin']
            );
            
            console.log(' Usuario admin creado: admin@inventario.com / admin123');
        }
    } catch (error) {
        console.error('Error insertando usuario admin:', error);
    }
};

module.exports = { createTables };