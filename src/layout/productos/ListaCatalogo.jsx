import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import Card from '../../components/Card';
import productoService from '../../service/productService';
import '../../styles/pages/ListaCatalogo.css';

const getProductos = productoService.getAll;
const deleteProducto = productoService.delete;
const searchProductos = productoService.search;

const ListaCatalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchProductos(searchTerm, categoriaFilter);
      setProductos(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProducto(id);
        cargarProductos();
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  return (
    <div className="lista-catalogo-container">
      <div className="page-header">
        <h1 className="page-title">Catálogo de Productos</h1>
        <Link
          to="/dashboard/productos/crear"
          className="btn-new-product"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="search-wrapper">
            <Search
              className="search-icon"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select
            className="filter-select"
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="btn-apply-filters"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Grid de productos */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : productos.length > 0 ? (
        <div className="products-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="product-card">
              {/* Header */}
              <div className="product-header">
                <div className="header-top">
                  <div className="sku-container">
                    <p className="sku-label">SKU</p>
                    <p className="sku-value">{producto.sku}</p>
                  </div>
                  <span
                    className={`stock-badge ${
                      producto.stock_actual <= producto.stock_minimo
                        ? 'low-stock'
                        : 'in-stock'
                    }`}
                  >
                    Stock: {producto.stock_actual || 0}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="product-content">
                <div className="product-name-container">
                  <p className="name-label">Nombre</p>
                  <p className="product-name">{producto.nombre}</p>
                </div>
                <div className="product-details">
                  <div className="detail-item">
                    <p className="detail-label">Categoría</p>
                    <p className="detail-value">{producto.categoria_nombre}</p>
                  </div>
                  <div className="detail-item">
                    <p className="detail-label">Unidad</p>
                    <p className="detail-value">{producto.unidad_medida}</p>
                  </div>
                </div>
                <div className="price-box">
                  <p className="price-label">Precio</p>
                  <p className="price-value">${producto.precio_unitario}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="product-actions">
                <Link
                  to={`/dashboard/productos/${producto.id}`}
                  className="action-btn action-btn-view"
                  title="Ver detalles"
                >
                  <Eye size={16} />
                  <span>Ver</span>
                </Link>
                <Link
                  to={`/dashboard/productos/editar/${producto.id}`}
                  className="action-btn action-btn-edit"
                  title="Editar"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </Link>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="action-btn action-btn-delete"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state-text">No hay productos disponibles</p>
        </div>
      )}

      {/* Alerta de stock bajo */}
      {!loading && productos.some((p) => p.stock_actual <= p.stock_minimo) && (
        <div className="low-stock-alert">
          <div className="alert-content">
            <AlertTriangle className="alert-icon" size={20} />
            <p className="alert-text">
              Hay {productos.filter(p => p.stock_actual <= p.stock_minimo).length} producto(s) con stock bajo. Revisa el inventario.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaCatalogo;

