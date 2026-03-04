// services/authService.jsx
import api from './api';

class AuthService {
    /**
     * Login de usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @param {boolean} remember - Si debe recordar la sesión
     */
    async login(email, password, remember = false) {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.token) {
                // Guardar token según preferencia de "recordar"
                if (remember) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } else {
                    sessionStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('user', JSON.stringify(response.data.user));
                }
                
                // Configurar token en axios para futuras peticiones
                this.setAuthToken(response.data.token);
                
                return {
                    success: true,
                    data: response.data,
                    message: response.data.message || 'Login exitoso'
                };
            }
            
            throw new Error('No se recibió token en la respuesta');
        } catch (error) {
            console.error('Error en login:', error);
            
            // Limpiar cualquier dato previo en caso de error
            this.clearStorage();
            
            return {
                success: false,
                error: error.response?.data?.message || 'Error en el login',
                status: error.response?.status
            };
        }
    }

    /**
     * Registro de nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @param {string} userData.nombre - Nombre del usuario
     * @param {string} userData.email - Email del usuario
     * @param {string} userData.password - Contraseña del usuario
     */
    async register(userData) {
        try {
            const response = await api.post('/auth/register', {
                nombre: userData.nombre,
                email: userData.email,
                password: userData.password
            });
            
            return {
                success: true,
                data: response.data,
                message: response.data.message || 'Registro exitoso'
            };
        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error en el registro',
                status: error.response?.status
            };
        }
    }

    /**
     * Verificar token actual
     */
    async verifyToken() {
        try {
            const token = this.getToken();
            if (!token) {
                return {
                    valid: false,
                    error: 'No hay token disponible'
                };
            }

            this.setAuthToken(token);
            const response = await api.get('/auth/verify');
            
            if (response.data.valid) {
                // Actualizar datos del usuario si es necesario
                if (response.data.user) {
                    const storage = this.getStorage();
                    if (storage) {
                        storage.setItem('user', JSON.stringify(response.data.user));
                    }
                }
                
                return {
                    valid: true,
                    user: response.data.user,
                    data: response.data
                };
            }
            
            // Token inválido, limpiar storage
            this.clearStorage();
            
            return {
                valid: false,
                error: 'Token inválido'
            };
        } catch (error) {
            console.error('Error verificando token:', error);
            
            // Si el token expiró o es inválido, limpiar storage
            if (error.response?.status === 401) {
                this.clearStorage();
            }
            
            return {
                valid: false,
                error: error.response?.data?.message || 'Error verificando token',
                status: error.response?.status
            };
        }
    }

    /**
     * Refrescar token
     */
    async refreshToken() {
        try {
            const token = this.getToken();
            if (!token) {
                return {
                    success: false,
                    error: 'No hay token para refrescar'
                };
            }

            const response = await api.post('/auth/refresh', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.token) {
                // Actualizar token en storage
                const storage = this.getStorage();
                if (storage) {
                    storage.setItem('token', response.data.token);
                }
                
                // Actualizar token en axios
                this.setAuthToken(response.data.token);
                
                return {
                    success: true,
                    token: response.data.token,
                    user: response.data.user
                };
            }
            
            return {
                success: false,
                error: 'No se pudo refrescar el token'
            };
        } catch (error) {
            console.error('Error refrescando token:', error);
            
            // Si el token es inválido, cerrar sesión
            if (error.response?.status === 401) {
                await this.logout();
            }
            
            return {
                success: false,
                error: error.response?.data?.message || 'Error refrescando token'
            };
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            const token = this.getToken();
            
            // Intentar logout en el backend
            if (token) {
                try {
                    await api.post('/auth/logout', {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (serverError) {
                    console.error('Error en logout del servidor:', serverError);
                    // Continuamos aunque falle el logout del servidor
                }
            }
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            // Siempre limpiar el storage local
            this.clearStorage();
        }
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        try {
            const storage = this.getStorage();
            if (!storage) return null;
            
            const userStr = storage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error);
            return null;
        }
    }

    /**
     * Obtener token actual
     */
    getToken() {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    /**
     * Obtener el storage actual (localStorage o sessionStorage)
     */
    getStorage() {
        return localStorage.getItem('token') ? localStorage : 
               sessionStorage.getItem('token') ? sessionStorage : null;
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Verificar si el usuario es admin
     */
    isAdmin() {
        const user = this.getCurrentUser();
        return user?.rol === 'admin';
    }

    /**
     * Configurar token en axios
     * @param {string} token - Token JWT
     */
    setAuthToken(token) {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }

    /**
     * Limpiar todo el storage
     */
    clearStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    }
}

// Crear una instancia única del servicio
const authService = new AuthService();
export default authService;