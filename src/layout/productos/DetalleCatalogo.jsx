import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Package, DollarSign, Tag, AlertTriangle, Plus } from 'lucide-react';
import Card from '../../components/Card';
import { getProducto } from '../../service/productService';
import '../../styles/pages/DetalleCatalogo.css';

const DetalleCatalogo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Cargando producto con ID:', id);
        
        // Cargar producto primero
        const productoRes = await getProducto(id);
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
          setLoading(false);
          return;
        }
        
        setProducto(productoData);
        
        // Usar stock_actual del producto si está disponible
        setStock(productoData.stock_actual || 0);
        
        // Cargar movimientos (con manejo de error silencioso)
        try {
          const movRes = await fetch(`/api/productos/${id}/movimientos`);
          if (movRes.ok) {
            const movData = await movRes.json();
            setMovimientos(movData || []);
          } else {
            console.log('Movimientos no disponibles (endpoint no existe)');
            setMovimientos([]);
          }
        } catch (movErr) {
          console.log('Error fetching movimientos:', movErr);
          setMovimientos([]);
        }
        
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos del producto. Verifica que el producto exista.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  

  if (loading) {
    return (
      <div className="detalle-catalogo-container">
        <div className="detalle-main">
          <div className="detalle-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="detalle-catalogo-container">
        <div className="detalle-main">
          <div className="detalle-content">
            <div className="not-found-container">
              <div className="not-found-content">
                <h2 className="not-found-title">{error || 'Producto no encontrado'}</h2>
                <Link to="/dashboard/productos/crear" className="btn-new-product">
                  <Plus size={20} />
                  Nuevo Producto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stockBajo = stock <= producto.stock_minimo;

  return (
    <div className="detalle-catalogo-container">
      <div className="detalle-main">
        <div className="detalle-content">
          <div className="detalle-wrapper">
            <div className="detalle-header">
              <button onClick={() => navigate('/dashboard/productos')} className="btn-back">
                <ArrowLeft size={20} />
                Volver al catálogo
              </button>
              <Link to={`/dashboard/productos/editar/${id}`} className="btn-edit">
                <Edit size={20} />
                Editar Producto
              </Link>
            </div>

            <Card className="detalle-card">
              <h1 className="detalle-title">{producto.nombre}</h1>
              
              {stockBajo && (
                <div className="low-stock-warning">
                  <div className="alert-content">
                    <AlertTriangle size={20} />
                    <p className="alert-text">
                      ¡Stock bajo! El stock actual ({stock}) está por debajo del mínimo ({producto.stock_minimo})
                    </p>
                  </div>
                </div>
              )}

              <div className="details-grid">
                <div className="detail-section">
                  <div className="detail-item">
                    <Tag className="detail-icon" size={20} />
                    <div>
                      <p className="detail-label">SKU</p>
                      <p className="detail-value">{producto.sku}</p>
                    </div>
                  </div>

                  <div className="detail-item" style={{ marginTop: '1rem' }}>
                    <Package className="detail-icon" size={20} />
                    <div>
                      <p className="detail-label">Categoría</p>
                      <p className="detail-value">{producto.categoria_nombre || 'Sin categoría'}</p>
                    </div>
                  </div>

                  <div className="detail-item" style={{ marginTop: '1rem' }}>
                    <DollarSign className="detail-icon" size={20} />
                    <div>
                      <p className="detail-label">Precio Unitario</p>
                      <p className="detail-value">${producto.precio_unitario}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-item">
                    <div>
                      <p className="detail-label">Unidad de Medida</p>
                      <p className="detail-value">{producto.unidad_medida}</p>
                    </div>
                  </div>

                  <div className="detail-item" style={{ marginTop: '1rem' }}>
                    <div>
                      <p className="detail-label">Stock Actual</p>
                      <p className={`stock-value ${stockBajo ? 'low' : 'normal'}`}>
                        {stock} {producto.unidad_medida}(s)
                      </p>
                    </div>
                  </div>

                  <div className="detail-item" style={{ marginTop: '1rem' }}>
                    <div>
                      <p className="detail-label">Stock Mínimo</p>
                      <p className="detail-value">{producto.stock_minimo} {producto.unidad_medida}(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              {producto.descripcion && (
                <div className="description-section">
                  <p className="description-label">Descripción</p>
                  <p className="description-text">{producto.descripcion}</p>
                </div>
              )}
            </Card>

            <Card className="movements-card">
              <h2 className="movements-title">Últimos Movimientos</h2>
              {movimientos.length > 0 ? (
                <div className="movements-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientos.map((mov, index) => (
                        <tr key={index}>
                          <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                          <td>
                            <span className={`movement-type ${mov.tipo}`}>
                              {mov.tipo}
                            </span>
                          </td>
                          <td>{mov.cantidad}</td>
                          <td>{mov.nota || mov.motivo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="movements-empty">No hay movimientos registrados</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCatalogo;