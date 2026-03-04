// services/userService.jsx
import api from './api';

class UserService {
    /**
     * Obtener todos los usuarios (solo admin)
     */
    async getAllUsers() {
        try {
            const response = await api.get('/usuarios');
            return {
                success: true,
                data: response.data,
                message: 'Usuarios obtenidos exitosamente'
            };
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener usuarios',
                status: error.response?.status
            };
        }
    }

    /**
     * Obtener usuario por ID (solo admin)
     * @param {number|string} id - ID del usuario
     */
    async getUserById(id) {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return {
                success: true,
                data: response.data,
                message: 'Usuario obtenido exitosamente'
            };
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener usuario',
                status: error.response?.status
            };
        }
    }

    /**
     * Obtener perfil del usuario autenticado
     */
    async getProfile() {
        try {
            const response = await api.get('/usuarios/profile/me');
            return {
                success: true,
                data: response.data,
                message: 'Perfil obtenido exitosamente'
            };
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener perfil',
                status: error.response?.status
            };
        }
    }

    /**
     * Actualizar usuario (solo admin)
     * @param {number|string} id - ID del usuario
     * @param {Object} userData - Datos a actualizar
     */
    async updateUser(id, userData) {
        try {
            const response = await api.put(`/usuarios/${id}`, userData);
            return {
                success: true,
                data: response.data,
                message: 'Usuario actualizado exitosamente'
            };
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar usuario',
                status: error.response?.status
            };
        }
    }

    /**
     * Eliminar usuario (soft delete) (solo admin)
     * @param {number|string} id - ID del usuario
     */
    async deleteUser(id) {
        try {
            const response = await api.delete(`/usuarios/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.message || 'Usuario eliminado exitosamente'
            };
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar usuario',
                status: error.response?.status
            };
        }
    }

    /**
     * Cambiar contraseña
     * @param {number|string} id - ID del usuario
     * @param {string} newPassword - Nueva contraseña
     */
    async changePassword(id, newPassword) {
        try {
            const response = await api.post(`/usuarios/${id}/change-password`, {
                password: newPassword
            });
            return {
                success: true,
                data: response.data,
                message: 'Contraseña actualizada exitosamente'
            };
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar contraseña',
                status: error.response?.status
            };
        }
    }

    /**
     * Obtener usuarios activos (solo admin)
     */
    async getActiveUsers() {
        try {
            const response = await api.get('/usuarios', {
                params: { activo: true }
            });
            return {
                success: true,
                data: response.data,
                message: 'Usuarios activos obtenidos exitosamente'
            };
        } catch (error) {
            console.error('Error obteniendo usuarios activos:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener usuarios activos',
                status: error.response?.status
            };
        }
    }

    /**
     * Buscar usuarios por email (solo admin)
     * @param {string} email - Email a buscar
     */
    async searchUsersByEmail(email) {
        try {
            const response = await api.get('/usuarios', {
                params: { email }
            });
            return {
                success: true,
                data: response.data,
                message: 'Búsqueda completada exitosamente'
            };
        } catch (error) {
            console.error('Error buscando usuarios:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al buscar usuarios',
                status: error.response?.status
            };
        }
    }

    /**
     * Obtener estadísticas de usuarios (solo admin)
     */
    async getUserStats() {
        try {
            const response = await api.get('/usuarios/stats');
            return {
                success: true,
                data: response.data,
                message: 'Estadísticas obtenidas exitosamente'
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener estadísticas',
                status: error.response?.status
            };
        }
    }

    /**
     * Activar/Desactivar usuario (solo admin)
     * @param {number|string} id - ID del usuario
     * @param {boolean} activo - Estado a establecer
     */
    async toggleUserStatus(id, activo) {
        try {
            const response = await api.patch(`/usuarios/${id}/status`, { activo });
            return {
                success: true,
                data: response.data,
                message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`
            };
        } catch (error) {
            console.error('Error cambiando estado del usuario:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar estado del usuario',
                status: error.response?.status
            };
        }
    }
}

// Crear una instancia única del servicio
const userService = new UserService();
export default userService;