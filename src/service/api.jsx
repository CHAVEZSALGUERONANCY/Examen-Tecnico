import axios from 'axios';

// Uses Vite environment variable (VITE_API_URL) or defaults to /api (for proxy)
// When running with Vite dev server, requests to /api are proxied to localhost:3000
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },  
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar token expirado
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido, limpiar y redirigir al login
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;