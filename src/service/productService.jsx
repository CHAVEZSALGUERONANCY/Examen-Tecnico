// src/service/productService.jsx
import api from './api';

// Named exports for direct importing
export const getAll = async () => {
    try {
        const response = await api.get('/productos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

export const getById = async (id) => {
    try {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto ${id}:`, error);
        throw error;
    }
};

// Alias for getById (used in DetalleCatalogo.jsx)
export const getProducto = getById;

// Alias for getById (used in EditarCatalogo.jsx)
export const getProductById = getById;

export const create = async (producto) => {
    try {
        const response = await api.post('/productos', producto);
        return response.data;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
};

export const update = async (id, producto) => {
    try {
        const response = await api.put(`/productos/${id}`, producto);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar producto ${id}:`, error);
        throw error;
    }
};

// Alias for update (used in EditarCatalogo.jsx)
export const updateProducto = update;

export const deleteProducto = async (id) => {
    try {
        const response = await api.delete(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar producto ${id}:`, error);
        throw error;
    }
};

// Search products
export const search = async (query) => {
    try {
        const response = await api.get('/productos/search', { params: { q: query } });
        return response.data;
    } catch (error) {
        console.error('Error al buscar productos:', error);
        throw error;
    }
};

// Get product stock (used in DetalleCatalogo.jsx)
export const getProductoStock = async (id) => {
    try {
        const response = await api.get(`/productos/${id}/stock`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener stock del producto ${id}:`, error);
        throw error;
    }
};

// Default export for backward compatibility
const productoService = {
    getAll,
    getById,
    getProducto: getById,
    getProductById: getById,
    create,
    update,
    updateProducto: update,
    delete: deleteProducto,
    deleteProducto,
    search,
    getProductoStock
};

export default productoService;

