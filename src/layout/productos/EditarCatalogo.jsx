import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import { getProductById, updateProducto } from '../../service/productService';
import '../../styles/pages/EditarCatalogo.css';

const EditarCatalogo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    sku: '',
    descripcion: '',
    categoria_id: '',
    precio_unitario: '',
    unidad_medida: '',
    stock_minimo: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setInitialLoading(true);
        setError('');

        console.log('Cargando producto con ID:', id);

        // Cargar categorías
        try {
          const categoriasRes = await fetch('/api/categorias');
          if (categoriasRes.ok) {
            const categoriasData = await categoriasRes.json();
            setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
          } else {
            console.log('No se pudieron cargar las categorías');
            setCategorias([]);
          }
        } catch (catErr) {
          console.error('Error cargando categorías:', catErr);
          setCategorias([]);
        }

        // Cargar producto
        console.log('Haciendo petición getProductById...');
        const productoRes = await getProductById(id);
        console.log('Respuesta cruda del API:', productoRes);
        console.log('Tipo de respuesta:', typeof productoRes);
        console.log('Es array?:', Array.isArray(productoRes));
        
        // Soporte para respuestas { data: {...} } o directamente el objeto
        let productoData = productoRes;
        
        // Si la respuesta tiene propiedad 'data', usarla
        if (productoRes && typeof productoRes === 'object' && 'data' in productoRes) {
          productoData = productoRes.data;
          console.log('Usando productoRes.data:', productoData);
        }
        
        // Si es un array, tomar el primer elemento
        if (Array.isArray(productoData) && productoData.length > 0) {
          console.log('La respuesta es un array, tomando primer elemento');
          productoData = productoData[0];
        }
        
        console.log('Datos finales del producto:', productoData);

        if (!productoData || productoData.id === undefined) {
          setError('Producto no encontrado');
          return;
        }

        const newFormData = {
          nombre: productoData.nombre || '',
          sku: productoData.sku || '',
          descripcion: productoData.descripcion || '',
          categoria_id: productoData.categoria_id || '',
          precio_unitario: productoData.precio_unitario || '',
          unidad_medida: productoData.unidad_medida || '',
          stock_minimo: productoData.stock_minimo ?? 0,
        };
        
        console.log('Setting formData:', newFormData);
        setFormData(newFormData);
        console.log('FormData should be updated now');
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await updateProducto(id, formData);
      navigate(`/dashboard/productos/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  /* ── Estado: cargando inicial ── */
  if (initialLoading) {
    return (
      <div className="editar-loading">
        <div className="editar-loading-spinner" />
      </div>
    );
  }

  /* ── Estado: error fatal (sin datos) ── */
  if (error && !formData.nombre) {
    return (
      <div className="editar-catalogo-container">
        <button
          onClick={() => navigate('/dashboard/productos')}
          className="editar-back-button"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </button>
        <div className="editar-error">
          <AlertCircle size={16} />
          {error}
        </div>
      </div>
    );
  }

  /* ── Vista principal ── */
  return (
    <div className="editar-catalogo-container">
      {/* Botón volver */}
      <button
        onClick={() => navigate(`/dashboard/productos/${id}`)}
        className="editar-back-button"
      >
        <ArrowLeft size={18} />
        Volver al detalle
      </button>

      <Card className="editar-card">
        <h1 className="editar-title">Editar Producto</h1>
        <p className="editar-subtitle">Modifica los campos que necesites y guarda los cambios.</p>
        <hr className="editar-divider" />

        {/* Error inline (no fatal) */}
        {error && (
          <div className="editar-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="editar-form-grid">

            {/* Nombre */}
            <div className="editar-form-group">
              <label className="editar-label">
                Nombre del Producto <span className="editar-label-required">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Ej. Harina de trigo"
                value={formData.nombre}
                onChange={handleChange}
                className="editar-input"
              />
            </div>

            {/* SKU (solo lectura) */}
            <div className="editar-form-group">
              <label className="editar-label">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                className="editar-input"
                disabled
                readOnly
              />
              <p className="editar-hint">El SKU no se puede modificar</p>
            </div>

            {/* Categoría */}
            <div className="editar-form-group">
              <label className="editar-label">
                Categoría <span className="editar-label-required">*</span>
              </label>
              <select
                name="categoria_id"
                required
                value={formData.categoria_id}
                onChange={handleChange}
                className="editar-select"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Unidad de medida */}
            <div className="editar-form-group">
              <label className="editar-label">
                Unidad de Medida <span className="editar-label-required">*</span>
              </label>
              <select
                name="unidad_medida"
                required
                value={formData.unidad_medida}
                onChange={handleChange}
                className="editar-select"
              >
                <option value="">Seleccionar unidad</option>
                <option value="unidad">Unidad</option>
                <option value="kg">Kilogramo</option>
                <option value="g">Gramo</option>
                <option value="l">Litro</option>
                <option value="ml">Mililitro</option>
                <option value="caja">Caja</option>
                <option value="paquete">Paquete</option>
              </select>
            </div>

            {/* Precio unitario */}
            <div className="editar-form-group">
              <label className="editar-label">
                Precio Unitario <span className="editar-label-required">*</span>
              </label>
              <input
                type="number"
                name="precio_unitario"
                required
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.precio_unitario}
                onChange={handleChange}
                className="editar-input"
              />
            </div>

            {/* Stock mínimo */}
            <div className="editar-form-group">
              <label className="editar-label">Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                min="0"
                value={formData.stock_minimo}
                onChange={handleChange}
                className="editar-input"
              />
            </div>

            {/* Descripción */}
            <div className="editar-form-group full-width">
              <label className="editar-label">Descripción</label>
              <textarea
                name="descripcion"
                rows={4}
                placeholder="Descripción opcional del producto..."
                value={formData.descripcion}
                onChange={handleChange}
                className="editar-textarea"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="editar-form-actions">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/productos/${id}`)}
              className="editar-btn editar-btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="editar-btn editar-btn-submit"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Actualizar Producto'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditarCatalogo;