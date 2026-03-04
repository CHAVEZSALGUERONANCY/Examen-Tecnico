import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../service/api';
import '../../styles/pages/Profile.css';

const Profile = () => {
  const { user: contextUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Verificar si hay token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          setError('No estás autenticado. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        // Usar la instancia de api que ya tiene el token configurado
        const response = await api.get('/usuarios/profile/me');
        setProfile(response.data.data || response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el perfil');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contextUser]);

  if (loading) {
    return (
      <div className="loading-message">
        <span className="loading-spinner"></span>
        Cargando perfil...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span className="error-icon">!</span>
        {error}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <p>Información de tu cuenta</p>
      </div>

      {profile && (
        <div className="profile-card">
          <div className="profile-info">
            <div className="info-item">
              <strong>Nombre</strong>
              <p>{profile.nombre}</p>
            </div>
            <div className="info-item">
              <strong>Email</strong>
              <p>{profile.email}</p>
            </div>
            <div className="info-item">
              <strong>Rol</strong>
              <p>{profile.rol}</p>
            </div>
            <div className="info-item">
              <strong>Fecha de Creación</strong>
              <p>{new Date(profile.created_at).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>

          <div className="profile-divider"></div>

          <div className="recent-changes">
            <h3>Cambios Recientes</h3>
            <div className="activities-placeholder">
              📋 Aquí se mostrarán tus cambios recientes: productos creados, entradas/salidas de inventario, y otras actividades.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;