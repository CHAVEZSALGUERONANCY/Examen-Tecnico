import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Package, Barcode, Tag, DollarSign, Ruler, AlertCircle } from 'lucide-react';
import productoService from '../../service/productService';
import '../../styles/pages/CrearCatalogo.css';

const createProducto = productoService.create;

const CrearCatalogo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    sku: '',
    descripcion: '',
    categoria_id: '',
    precio_unitario: '',
    unidad_medida: '',
    stock_minimo: 0
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const nuevoProducto = await createProducto(formData);
      navigate(`/productos/${nuevoProducto.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const unidadesMedida = [
    { value: 'unidad', label: 'Unidad', icon: '📦' },
    { value: 'kg', label: 'Kilogramo (kg)', icon: '⚖️' },
    { value: 'g', label: 'Gramo (g)', icon: '⚖️' },
    { value: 'l', label: 'Litro (l)', icon: '🧪' },
    { value: 'ml', label: 'Mililitro (ml)', icon: '🧪' },
    { value: 'caja', label: 'Caja', icon: '📦' },
    { value: 'paquete', label: 'Paquete', icon: '📦' }
  ];

  return (
    <div className="crear-catalogo-container">
      <div className="container">
        {/* Header con navegación */}
        <div className="back-button-container">
          <button
            onClick={() => navigate('/productos')}
            className="back-button"
          >
            <ArrowLeft size={20} />
            <span>Volver al catálogo</span>
          </button>
        </div>

        {/* Tarjeta principal */}
        <div className="crear-catalogo-card">
          {/* Cabecera con gradiente */}
          <div className="card-header">
            <div className="card-header-content">
              <div className="header-icon">
                <Package size={32} />
              </div>
              <div className="header-title">
                <h1>Crear Nuevo Producto</h1>
                <p>Completa los detalles del producto para agregarlo al catálogo</p>
              </div>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="card-content">
            {error && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <div>
                  <p className="error-title">Error al crear el producto</p>
                  <p className="error-message">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Grid de campos */}
              <div className="form-grid">
                {/* Nombre del producto */}
                <div className="form-group">
                  <label className="form-label">
                    <Tag size={16} />
                    Nombre del Producto <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Laptop HP Pavilion"
                    className="form-input"
                  />
                </div>

                {/* SKU */}
                <div className="form-group">
                  <label className="form-label">
                    <Barcode size={16} />
                    SKU <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ej: HP-PAV-15-2024"
                    className="form-input"
                  />
                </div>

                {/* Categoría */}
                <div className="form-group">
                  <label className="form-label">
                    <Package size={16} />
                    Categoría <span className="required">*</span>
                  </label>
                  <select
                    name="categoria_id"
                    required
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Unidad de Medida */}
                <div className="form-group">
                  <label className="form-label">
                    <Ruler size={16} />
                    Unidad de Medida <span className="required">*</span>
                  </label>
                  <select
                    name="unidad_medida"
                    required
                    value={formData.unidad_medida}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar unidad</option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.value} value={unidad.value}>
                        {unidad.icon} {unidad.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Precio Unitario */}
                <div className="form-group">
                  <label className="form-label">
                    <DollarSign size={16} />
                    Precio Unitario <span className="required">*</span>
                  </label>
                  <div className="input-prefix">
                    <span className="prefix">$</span>
                    <input
                      type="number"
                      name="precio_unitario"
                      required
                      step="0.01"
                      min="0"
                      value={formData.precio_unitario}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Stock Mínimo */}
                <div className="form-group">
                  <label className="form-label">
                    <AlertCircle size={16} />
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stock_minimo"
                    min="0"
                    value={formData.stock_minimo}
                    onChange={handleChange}
                    placeholder="0"
                    className="form-input"
                  />
                </div>

                {/* Descripción - Ocupa ambas columnas */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    rows="4"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe las características del producto..."
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Línea divisoria decorativa */}
              <div className="divider">
                <div className="divider-line"></div>
              </div>

              {/* Botones de acción */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/productos')}
                  className="btn btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-submit"
                >
                  <Save size={20} />
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Producto'
                  )}
                </button>
              </div>

              {/* Campos requeridos hint */}
              <p className="required-hint">
                <span>*</span> Campos obligatorios
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearCatalogo;

