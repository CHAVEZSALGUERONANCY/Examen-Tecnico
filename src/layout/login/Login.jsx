// src/pages/login/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setLoginError('');
      
      try {
        const user = await login(formData.email, formData.password, formData.rememberMe);
        if (user) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error en login:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError('Error al iniciar sesión');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {loginError && (
            <div className="error-general">{loginError}</div>
          )}

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

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Recordarme</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="register-link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;