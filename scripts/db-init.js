#!/usr/bin/env node

const { createTables, dropTables, resetTables } = require('../src/config/initTables');
const { promisePool } = require('../src/config/db');
require('dotenv').config();

const command = process.argv[2];

const run = async () => {
    try {
        switch (command) {
            case 'create':
                console.log(' Creando tablas...');
                await createTables();
                break;
                
            case 'drop':
                console.log(' Eliminando tablas...');
                await dropTables();
                break;
                
            case 'reset':
                console.log(' Reiniciando base de datos...');
                await resetTables();
                break;
                
            case 'show':
                console.log('📊 Mostrando tablas...');
                const [tables] = await promisePool.query('SHOW TABLES');
                console.log('Tablas en la base de datos:');
                tables.forEach(table => {
                    console.log(`  - ${Object.values(table)[0]}`);
                });
                break;
                
            default:
                console.log(`
Uso: node scripts/db-init.js [comando]

Comandos disponibles:
  create    Crear todas las tablas
  drop      Eliminar todas las tablas
  reset     Reiniciar base de datos (drop + create)
  show      Mostrar tablas existentes
                `);
        }
        
        console.log(' Comando ejecutado correctamente');
        process.exit(0);
    } catch (error) {
        console.error(' Error:', error);
        process.exit(1);
    }
};

run();
