// src/pages/login/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const [loading, setLoading] = useState(false); // Para mostrar estado de carga
  const [registerSuccess, setRegisterSuccess] = useState(false); // Para éxito
  const navigate = useNavigate(); // Hook para navegación

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      try {
        const data = await register({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        });

        setRegisterSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        console.error('Error en registro:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: 'Error al registrar usuario' });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Crear cuenta</h1>
          <p>Regístrate para comenzar</p>
        </div>

        {registerSuccess ? (
          <div className="success-message">
            <h2>✅ ¡Registro exitoso!</h2>
            <p>Serás redirigido al login en unos segundos...</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="register-form">
              {/* Mostrar error general si existe */}
              {errors.general && (
                <div className="error-general">{errors.general}</div>
              )}

              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className={errors.nombre ? 'error' : ''}
                  disabled={loading}
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className={errors.email ? 'error' : ''}
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group terms-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>
                    Acepto los{' '}
                    <Link to="/terms" className="terms-link">
                      términos y condiciones
                    </Link>
                  </span>
                </label>
                {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}
              </div>

              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            <div className="register-footer">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/" className="login-link">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;