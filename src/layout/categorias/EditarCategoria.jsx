import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import Card from '../../components/Card';
import { getById, update as updateCategoria } from '../../service/categoriaService';
import '../../styles/pages/EditarCatalogo.css';

const EditarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setInitialLoading(true);
        setError('');

        console.log('Cargando categoría con ID:', id);

        // Cargar categoría por ID
        const categoriaRes = await getById(id);
        console.log('Respuesta cruda del API:', categoriaRes);
        console.log('Tipo de respuesta:', typeof categoriaRes);
        
        // Soporte para respuestas { data: {...} } o directamente el objeto
        let categoriaData = categoriaRes;
        
        // Si la respuesta tiene propiedad 'data', usarla
        if (categoriaRes && typeof categoriaRes === 'object' && 'data' in categoriaRes) {
          categoriaData = categoriaRes.data;
          console.log('Usando categoriaRes.data:', categoriaData);
        }
        
        // Si es un array, tomar el primer elemento
        if (Array.isArray(categoriaData) && categoriaData.length > 0) {
          console.log('La respuesta es un array, tomando primer elemento');
          categoriaData = categoriaData[0];
        }
        
        console.log('Datos finales de la categoría:', categoriaData);

        if (!categoriaData || categoriaData.id === undefined) {
          setError('Categoría no encontrada');
          return;
        }

        const newFormData = {
          nombre: categoriaData.nombre || '',
          descripcion: categoriaData.descripcion || ''
        };
        
        console.log('Setting formData:', newFormData);
        setFormData(newFormData);
        console.log('FormData should be updated now');
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos de la categoría. Verifica que la categoría exista en la base de datos.');
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
      await updateCategoria(id, formData);
      navigate('/dashboard/categorias');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la categoría');
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
          onClick={() => navigate('/dashboard/categorias')}
          className="editar-back-button"
        >
          <ArrowLeft size={18} />
          Volver a categorías
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
        onClick={() => navigate('/dashboard/categorias')}
        className="editar-back-button"
      >
        <ArrowLeft size={18} />
        Volver a categorías
      </button>

      <Card className="editar-card">
        <h1 className="editar-title">Editar Categoría</h1>
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
                Nombre de la Categoría <span className="editar-label-required">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                required
                placeholder="Ej. Electrónica"
                value={formData.nombre}
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
                placeholder="Descripción opcional de la categoría..."
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
              onClick={() => navigate('/dashboard/categorias')}
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
              {loading ? 'Guardando...' : 'Actualizar Categoría'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditarCategoria;

