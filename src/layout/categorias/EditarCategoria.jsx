import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getById, update as updateCategoria } from '../../service/categoriaService';
import '../../styles/pages/ListaCategorias.css'; // Usamos el mismo CSS

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

        const categoriaRes = await getById(id);
        console.log('Respuesta cruda del API:', categoriaRes);
        
        let categoriaData = categoriaRes;
        
        if (categoriaRes && typeof categoriaRes === 'object' && 'data' in categoriaRes) {
          categoriaData = categoriaRes.data;
          console.log('Usando categoriaRes.data:', categoriaData);
        }
        
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

  const handleCancel = () => {
    navigate('/dashboard/categorias');
  };

  if (initialLoading) {
    return (
      <div className="lista-categorias-container">
        <div className="loading">Cargando categoría...</div>
      </div>
    );
  }

  if (error && !formData.nombre) {
    return (
      <div className="lista-categorias-container">
        <div className="categorias-header">
          <h1 className="categorias-title">Editar Categoría</h1>
          <button onClick={handleCancel} className="btn-primary">
            ← Volver a Categorías
          </button>
        </div>
        <div className="error">
          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lista-categorias-container">
      <div className="categorias-header">
        <h1 className="categorias-title">Editar Categoría</h1>
        <button onClick={handleCancel} className="btn-primary">
          ← Volver a Categorías
        </button>
      </div>

      <div className="table-container" style={{ padding: '2rem' }}>
        {error && (
          <div className="error" style={{ marginBottom: '1.5rem' }}>
            <span style={{ marginRight: '0.5rem' }}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre de la Categoría <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                required
                placeholder="Ej. Electrónica, Oficina, Limpieza..."
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Descripción opcional de la categoría..."
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>

            {/* Acciones */}
            <div className="modal-actions" style={{ marginTop: '2rem' }}>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  'Guardando...'
                ) : (
                  <>
                    <span className="btn-icon">✓</span>
                    Actualizar Categoría
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCategoria;