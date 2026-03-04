import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Package } from 'lucide-react';
import Card from '../../components/Card';
import '../../styles/pages/EditarStock.css';

const EditarStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [producto, setProducto] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    stock_actual: 0,
    stock_minimo: 0,
  });

  // Función para obtener el token
  const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

useEffect(() => {
    const cargarDatos = async () => {
      try {
        setInitialLoading(true);
        setError('');

        console.log('Cargando producto con ID:', id);

        const token = getToken();
        
        // Intentar diferentes endpoints
        let response;
        let productoData;
        
// Primero intentar /api/productos/{id}
        try {
          response = await fetch(`/api/productos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            productoData = await response.json();
            // Si es array, tomar primer elemento
            if (Array.isArray(productoData) && productoData.length > 0) {
              productoData = productoData[0];
            }
          }
        } catch {
          console.log('Endpoint /api/productos no funciona, intentando /api/inventario');
        }

        // Si no funcionó, intentar endpoint de inventario
        if (!productoData || !productoData.id) {
          response = await fetch(`/api/inventario/productos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            productoData = await response.json();
          }
        }

        // Si todavía no hay datos, intentar con endpoint de stock-bajo para buscar
        if (!productoData || !productoData.id) {
          // Obtener lista de stock bajo y buscar el producto
          response = await fetch('/api/inventario/stock-bajo', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const productos = await response.json();
            productoData = productos.find(p => p.id === parseInt(id));
          }
        }

        if (!productoData || productoData.id === undefined) {
          setError('Producto no encontrado');
          return;
        }

        console.log('Datos del producto:', productoData);

        setProducto(productoData);

        const newFormData = {
          stock_actual: productoData.stock_actual ?? 0,
          stock_minimo: productoData.stock_minimo ?? 0,
        };
        
        console.log('Setting formData:', newFormData);
        setFormData(newFormData);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos del producto. Verifica que el producto exista en la base de datos.');
      } finally {
        setInitialLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'stock_actual' || name === 'stock_minimo' 
        ? parseInt(value, 10) || 0 
        : value 
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const token = getToken();

      // Intentar diferentes endpoints para actualizar el stock
      let response;
      let success = false;
      
      // Intentar /api/productos/{id}
      try {
        response = await fetch(`/api/productos/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stock_actual: formData.stock_actual,
            stock_minimo: formData.stock_minimo
          })
        });
        
        if (response.ok) {
          success = true;
        }
      } catch {
        console.log('Endpoint /api/productos no funciona para actualizar, intentando otro');
      }

      // Si no funcionó, intentar /api/inventario/productos/{id}/stock
      if (!success) {
        response = await fetch(`/api/inventario/productos/${id}/stock`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stock_actual: formData.stock_actual,
            stock_minimo: formData.stock_minimo
          })
        });

        if (response.ok) {
          success = true;
        }
      }

      if (!success || !response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el stock');
      }

      const result = await response.json();
      console.log('Stock actualizado:', result);
      
      setSuccess(true);
      
      // Mostrar mensaje de éxito y navegar después de un momento
      setTimeout(() => {
        navigate('/dashboard/stock-bajo');
      }, 1500);
      
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      setError(err.message || 'Error al actualizar el stock');
    } finally {
      setLoading(false);
    }
  };

  /* ── Estado: cargando inicial ── */
  if (initialLoading) {
    return (
      <div className="editar-stock-loading">
        <div className="editar-stock-loading-spinner" />
      </div>
    );
  }

  /* ── Estado: error fatal (sin datos) ── */
  if (error && !producto) {
    return (
      <div className="editar-stock-container">
        <button
          onClick={() => navigate('/dashboard/stock-bajo')}
          className="editar-stock-back-button"
        >
          <ArrowLeft size={18} />
          Volver a stock bajo
        </button>
        <div className="editar-stock-error">
          <AlertCircle size={16} />
          {error}
        </div>
      </div>
    );
  }

  /* ── Vista principal ── */
  return (
    <div className="editar-stock-container">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/dashboard/stock-bajo')}
        className="editar-stock-back-button"
      >
        <ArrowLeft size={18} />
        Volver a stock bajo
      </button>

      <Card className="editar-stock-card">
        <div className="editar-stock-header">
          <div className="editar-stock-icon">
            <Package size={32} />
          </div>
          <div className="editar-stock-title-section">
            <h1 className="editar-stock-title">Editar Stock</h1>
            <p className="editar-stock-subtitle">
              {producto?.nombre || 'Producto'} - SKU: {producto?.sku || 'N/A'}
            </p>
          </div>
        </div>
        
<hr className="editar-stock-divider" />

        {/* Success message */}
        {success && (
          <div className="editar-stock-success">
            <AlertCircle size={16} />
            Stock actualizado correctamente. Redirigiendo...
          </div>
        )}

        {/* Error inline (no fatal) */}
        {error && !success && (
          <div className="editar-stock-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="editar-stock-form-grid">
            {/* Stock Actual */}
            <div className="editar-stock-form-group">
              <label className="editar-stock-label">
                Stock Actual <span className="editar-stock-label-required">*</span>
              </label>
              <input
                type="number"
                name="stock_actual"
                required
                min="0"
                value={formData.stock_actual}
                onChange={handleChange}
                className="editar-stock-input"
                placeholder="Cantidad actual en inventario"
              />
              <p className="editar-stock-hint">
                Cantidad disponible actualmente en inventario
              </p>
            </div>

            {/* Stock Mínimo */}
            <div className="editar-stock-form-group">
              <label className="editar-stock-label">
                Stock Mínimo <span className="editar-stock-label-required">*</span>
              </label>
              <input
                type="number"
                name="stock_minimo"
                required
                min="0"
                value={formData.stock_minimo}
                onChange={handleChange}
                className="editar-stock-input"
                placeholder="Cantidad mínima requerida"
              />
              <p className="editar-stock-hint">
                Cantidad mínima antes de mostrar alerta de stock bajo
              </p>
            </div>

            {/* Información adicional del producto (solo lectura) */}
            <div className="editar-stock-form-group full-width">
              <label className="editar-stock-label">Información del Producto</label>
              <div className="editar-stock-info-box">
                <div className="info-row">
                  <span className="info-label">Categoría:</span>
                  <span className="info-value">{producto?.categoria_nombre || 'Sin categoría'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Unidad de Medida:</span>
                  <span className="info-value">{producto?.unidad_medida || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Precio Unitario:</span>
                  <span className="info-value">
                    {producto?.precio_unitario 
                      ? `$${parseFloat(producto.precio_unitario).toFixed(2)}` 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="editar-stock-form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard/stock-bajo')}
              className="editar-stock-btn editar-stock-btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="editar-stock-btn editar-stock-btn-submit"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Actualizar Stock'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditarStock;

