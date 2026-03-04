import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../service/authService';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error verificando usuario:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, remember = false) => {
    try {
      setError(null);
      const result = await authService.login(email, password, remember);
      if (!result?.success) {
        throw new Error(result?.error || 'Error al iniciar sesión');
      }
      setUser(result.data.user);
      return result;
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const result = await authService.register(userData);
      if (!result?.success) {
        throw new Error(result?.error || 'Error al registrar usuario');
      }
      return result;
    } catch (error) {
      setError(error.message || 'Error al registrar usuario');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
