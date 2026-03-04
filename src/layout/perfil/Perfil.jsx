import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta según tu estructura

const Perfil = () => {
  const { user, logout } = useAuth(); // Asume que tienes user en el contexto
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No estás autenticado');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3000/api/usuarios/profile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
      {profile && (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Nombre:</strong> {profile.nombre}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Rol:</strong> {profile.rol}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          
          {/* Sección para cambios/actividades */}
          <h3 className="text-lg font-semibold mt-4">Cambios Recientes</h3>
          <p className="text-gray-600">Aquí puedes mostrar entradas, salidas u otras actividades del usuario. Si tienes endpoints adicionales, intégralos aquí.</p>
          {/* Ejemplo: Lista de actividades si las obtienes */}
        </div>
      )}
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Perfil;