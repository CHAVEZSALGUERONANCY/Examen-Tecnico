import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Edit2 } from 'lucide-react';
import '../../styles/pages/StockBajo.css';

const StockBajo = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductosStockBajo();
  }, []);

  const cargarProductosStockBajo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventario/stock-bajo');
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProductos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos con stock bajo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularDiferencia = (actual, minimo) => {
    return minimo - actual;
  };

  if (loading) {
    return (
      <div className="stock-bajo-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-bajo-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stock-bajo-container">
      <div className="stock-bajo-header">
        <div className="header-content">
          <AlertTriangle className="header-icon" size={28} />
          <h1 className="stock-bajo-title">Productos con Stock Bajo</h1>
          <p className="total-count">Total: {productos.length} producto(s)</p>
        </div>
        
      </div>

      {productos.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle size={48} className="empty-icon" />
          <p className="empty-text">¡Excelente! No hay productos con stock bajo.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="stock-table">
<thead>
              <tr>
                <th>SKU</th>
                <th>Nombre del Producto</th>
                <th>Categoría</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Diferencia</th>
                <th>% Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => {
                const diferencia = calcularDiferencia(producto.stock_actual || 0, producto.stock_minimo || 0);
                const porcentaje = producto.stock_minimo > 0 
                  ? Math.round(((producto.stock_actual || 0) / producto.stock_minimo) * 100)
                  : 0;

                return (
                  <tr key={producto.id} className="stock-bajo-row">
                    <td className="sku-cell">
                      <span className="sku-badge">{producto.sku}</span>
                    </td>
                    <td className="nombre-cell">
                      <div className="producto-info">
                        <span className="producto-nombre">{producto.nombre}</span>
                        <span className="unidad-medida">{producto.unidad_medida}</span>
                      </div>
                    </td>
                    <td className="categoria-cell">{producto.categoria_nombre || 'Sin categoría'}</td>
                    <td className="stock-actual-cell">
                      <span className={`stock-value ${porcentaje < 50 ? 'critical' : 'warning'}`}>
                        {producto.stock_actual || 0}
                      </span>
                    </td>
                    <td className="stock-minimo-cell">{producto.stock_minimo || 0}</td>
                    <td className="diferencia-cell">
                      <span className="diferencia-valor">+{diferencia}</span>
                    </td>
                    <td className="porcentaje-cell">
                      <div className="porcentaje-container">
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${porcentaje < 50 ? 'critical' : 'warning'}`}
                            style={{ width: `${Math.min(porcentaje, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`porcentaje-text ${porcentaje < 50 ? 'critical' : 'warning'}`}>
                          {porcentaje}%
                        </span>
                      </div>
                    </td>
                    <td className="acciones-cell">
                      <button 
                        className="btn-editar-stock"
                        onClick={() => navigate(`/dashboard/stock/editar/${producto.id}`)}
                        title="Editar Stock"
                      >
                        <Edit2 size={16} />
                        Editar Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="stock-bajo-footer">
        <div className="footer-info">
          <p className="info-text">
            <AlertTriangle size={16} />
            Se muestra un producto cuando su stock actual está por debajo del stock mínimo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockBajo;