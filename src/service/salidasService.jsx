// src/service/salidaService.js
import api from './api';

// Obtener todas las salidas
export const getAll = async () => {
    try {
        const response = await api.get('/salidas');
        return response?.data ?? [];
    } catch (error) {
        console.error('Error al obtener salidas:', error);
        throw error;
    }
};

// Obtener salida por ID
export const getById = async (id) => {
    try {
        const response = await api.get(`/salidas/${id}`);
        return response?.data ?? null;
    } catch (error) {
        console.error(`Error al obtener salida ${id}:`, error);
        throw error;
    }
};

// Obtener salidas por motivo
export const getByMotivo = async (motivo) => {
    try {
        const response = await api.get(`/salidas/motivo/${motivo}`);
        return response?.data ?? [];
    } catch (error) {
        console.error(`Error al obtener salidas por motivo ${motivo}:`, error);
        throw error;
    }
};

// Crear nueva salida - VERSIÓN MEJORADA CON VALIDACIÓN
export const create = async (salida) => {
    try {
        // Validar que los datos existen
        if (!salida) {
            throw new Error('No se proporcionaron datos para crear la salida');
        }

        // Validar campos requeridos
        if (!salida.producto_id || !salida.cantidad || !salida.motivo) {
            throw new Error('Faltan campos requeridos: producto_id, cantidad y motivo son obligatorios');
        }

        console.log('Enviando datos al servidor:', salida);
        
        const response = await api.post('/salidas', salida);
        
        // Verificar que la respuesta existe
        if (!response) {
            throw new Error('No se recibió respuesta del servidor');
        }

        console.log('Respuesta del servidor:', response);
        
        // Verificar si hay datos en la respuesta
        if (!response.data) {
            console.warn('La respuesta no contiene datos, pero la operación fue exitosa');
            return { success: true, message: 'Salida creada exitosamente' };
        }

        return response.data;
        
    } catch (error) {
        // Mejorar el logging del error
        console.error('Error detallado al crear salida:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        // Relanzar el error con más información
        if (error.response) {
            throw new Error(error.response.data?.message || `Error del servidor: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        } else {
            throw error;
        }
    }
};

// Eliminar salida
export const deleteSalida = async (id) => {
    try {
        if (!id) {
            throw new Error('Se requiere un ID para eliminar la salida');
        }
        
        const response = await api.delete(`/salidas/${id}`);
        return response?.data ?? { success: true };
    } catch (error) {
        console.error(`Error al eliminar salida ${id}:`, error);
        throw error;
    }
};

// Default export para compatibilidad
const salidaService = {
    getAll,
    getById,
    getByMotivo,
    create,
    delete: deleteSalida
};

export default salidaService;