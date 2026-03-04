// src/services/categoriaService.jsx
import api from './api';

// Named exports for direct importing
export const getAll = async () => {
    try {
        const response = await api.get('/categorias');
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
};

export const getById = async (id) => {
    try {
        const response = await api.get(`/categorias/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener categoría ${id}:`, error);
        throw error;
    }
};

export const create = async (categoria) => {
    try {
        const response = await api.post('/categorias', categoria);
        return response.data;
    } catch (error) {
        console.error('Error al crear categoría:', error);
        throw error;
    }
};

export const update = async (id, categoria) => {
    try {
        const response = await api.put(`/categorias/${id}`, categoria);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar categoría ${id}:`, error);
        throw error;
    }
};

export const deleteCategoria = async (id) => {
    try {
        const response = await api.delete(`/categorias/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar categoría ${id}:`, error);
        throw error;
    }
};

// Default export for backward compatibility
const categoriaService = {
    getAll,
    getById,
    create,
    update,
    delete: deleteCategoria
};

export default categoriaService;
