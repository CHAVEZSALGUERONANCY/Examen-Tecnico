// src/services/adminService.jsx
import api from './api';
import authService from './authService';

class AdminService {
  /**
   * Obtener perfil del usuario actual
   * Usa la ruta: GET /api/users/profile/me
   */
  async getProfile() {
    try {
      const response = await api.get('/users/profile/me');
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
   * Actualizar perfil del usuario actual
   * Usa la ruta: PUT /api/users/profile/me
   * Nota: Como no hay una ruta específica para actualizar perfil propio,
   * podrías necesitar crear una en el backend o usar la ruta de admin
   * Por ahora, asumimos que usaremos la ruta de admin con el ID del usuario
   */
  async updateProfile(profileData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('No se encontró el usuario actual');
      }

      // Usamos la ruta de admin pero con el ID del usuario actual
      const response = await api.put(`/users/${currentUser.id}`, profileData);
      
      // Actualizar usuario en storage
      if (response.data.user) {
        const storage = authService.getStorage();
        if (storage) {
          const updatedUser = { ...currentUser, ...response.data.user };
          storage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar perfil',
        status: error.response?.status
      };
    }
  }

  /**
   * Obtener todos los usuarios (solo admin)
   */
  async getAllUsers() {
    try {
      const response = await api.get('/users');
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
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
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
   * Actualizar usuario por ID (solo admin)
   */
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Usuario actualizado exitosamente'
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
   * Eliminar usuario (solo admin)
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
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
}

// Crear una instancia única del servicio
const adminService = new AdminService();
export default adminService;