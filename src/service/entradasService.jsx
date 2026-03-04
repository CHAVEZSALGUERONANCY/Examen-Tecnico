// src/service/entradaService.js
import api from './api';

// Obtener todas las entradas
export const getAll = async () => {
    try {
        const response = await api.get('/entradas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener entradas:', error);
        throw error;
    }
};

// Obtener entrada por ID
export const getById = async (id) => {
    try {
        const response = await api.get(`/entradas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener entrada ${id}:`, error);
        throw error;
    }
};

// Obtener entradas por producto
export const getByProducto = async (productoId) => {
    try {
        const response = await api.get(`/entradas/producto/${productoId}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener entradas del producto ${productoId}:`, error);
        throw error;
    }
};

// Obtener entradas por rango de fechas
export const getByDateRange = async (fechaInicio, fechaFin) => {
    try {
        const response = await api.get('/entradas/rango-fechas', {
            params: { inicio: fechaInicio, fin: fechaFin }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener entradas por rango de fechas:', error);
        throw error;
    }
};

// Crear nueva entrada
export const create = async (entrada) => {
    try {
        const response = await api.post('/entradas', entrada);
        return response.data;
    } catch (error) {
        console.error('Error al crear entrada:', error);
        throw error;
    }
};

// Eliminar entrada (si decides implementarlo en el backend)
export const deleteEntrada = async (id) => {
    try {
        const response = await api.delete(`/entradas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar entrada ${id}:`, error);
        throw error;
    }
};

// Default export para compatibilidad
const entradaService = {
    getAll,
    getById,
    getByProducto,
    getByDateRange,
    create,
    delete: deleteEntrada,
    deleteEntrada
};

export default entradaService;