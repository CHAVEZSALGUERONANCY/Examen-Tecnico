// src/layout/salidas/ListaSalidas.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getAll as getSalidas, getByMotivo, create as createSalida, deleteSalida } from '../../service/salidasService';
import { getAll as getProductos } from '../../service/productService';
import '../../styles/pages/ListaSalidas.css';

const ListaSalidas = () => {
    const [salidas, setSalidas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filtroMotivo, setFiltroMotivo] = useState('');
    const [filtroActivo, setFiltroActivo] = useState(false);
    const [motivos, setMotivos] = useState([]);

    // Definir cargarSalidas como useCallback para usarlo en dependencias
    const cargarSalidas = useCallback(async () => {
        try {
            const data = await getSalidas();
            setSalidas(data);
            
            // Extraer motivos únicos para el filtro
            const motivosUnicos = [...new Set(data.map(s => s.motivo))];
            setMotivos(motivosUnicos);
        } catch (err) {
            console.error('Error al cargar salidas:', err);
            throw err;
        }
    }, []);

    // Definir cargarProductos como useCallback
    const cargarProductos = useCallback(async () => {
        try {
            const data = await getProductos();
            setProductos(data);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            throw err;
        }
    }, []);

    // Definir cargarDatosIniciales como useCallback
    const cargarDatosIniciales = useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                cargarSalidas(),
                cargarProductos()
            ]);
            setError(null);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [cargarSalidas, cargarProductos]);

    useEffect(() => {
        cargarDatosIniciales();
    }, [cargarDatosIniciales]);

    const handleFiltrarPorMotivo = async (e) => {
        e.preventDefault();
        if (!filtroMotivo) {
            alert('Debes seleccionar un motivo');
            return;
        }

        try {
            setLoading(true);
            const data = await getByMotivo(filtroMotivo);
            setSalidas(data);
            setFiltroActivo(true);
            setError(null);
        } catch (err) {
            setError('Error al filtrar por motivo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiarFiltro = async () => {
        setFiltroMotivo('');
        setFiltroActivo(false);
        await cargarSalidas();
    };

    const handleCrear = () => {
        setModalOpen(true);
    };

    const handleGuardar = async (salidaData) => {
        try {
            await createSalida(salidaData);
            setModalOpen(false);
            if (filtroActivo) {
                await handleLimpiarFiltro();
            } else {
                await cargarSalidas();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar la salida');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta salida?')) {
            try {
                await deleteSalida(id);
                if (filtroActivo) {
                    await handleLimpiarFiltro();
                } else {
                    await cargarSalidas();
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Error al eliminar la salida');
            }
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getNombreProducto = (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        return producto ? producto.nombre : 'Producto no encontrado';
    };

    // Esta función ya no está sin usar, ahora la usamos en el modal
    // pero como ahora la función está definida, la mantenemos
    // aunque en realidad no se usa directamente en este componente
    // sino que se pasa al ModalSalida

    if (loading && salidas.length === 0) return <div className="loading">Cargando salidas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="lista-salidas-container">
            <div className="salidas-header">
                <h1 className="salidas-title">Lista de Salidas</h1>
                <button onClick={handleCrear} className="btn-primary">
                    Nueva Salida
                </button>
            </div>

            {/* Filtro por motivo */}
            <div className="filtro-container">
                <form onSubmit={handleFiltrarPorMotivo} className="filtro-form">
                    <div className="filtro-group">
                        <label>Filtrar por motivo:</label>
                        <select
                            value={filtroMotivo}
                            onChange={(e) => setFiltroMotivo(e.target.value)}
                            className="filtro-select"
                        >
                            <option value="">Todos los motivos</option>
                            {motivos.map((motivo, index) => (
                                <option key={index} value={motivo}>
                                    {motivo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filtro-actions">
                        <button type="submit" className="btn-filter">
                            Filtrar
                        </button>
                        {filtroActivo && (
                            <button type="button" onClick={handleLimpiarFiltro} className="btn-clear">
                                Limpiar filtro
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {salidas.length === 0 ? (
                <div className="empty-state">
                    <p>
                        {filtroActivo 
                            ? 'No hay salidas con el motivo seleccionado' 
                            : 'No hay salidas registradas'}
                    </p>
                    <button onClick={handleCrear} className="btn-primary">
                        Registrar primera salida
                    </button>
                </div>
            ) : (
                <>
                    {filtroActivo && (
                        <div className="filtro-info">
                            Mostrando salidas con motivo: <strong>{filtroMotivo}</strong>
                        </div>
                    )}
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Fecha</th>
                                    <th>Motivo</th>
                                    <th>Registrado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salidas.map((salida) => (
                                    <tr key={salida.id}>
                                        <td>{salida.id}</td>
                                        <td>
                                            <div className="producto-info">
                                                <span className="producto-nombre">
                                                    {salida.producto_nombre || getNombreProducto(salida.producto_id)}
                                                </span>
                                                {salida.sku && (
                                                    <span className="producto-sku">SKU: {salida.sku}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="cantidad">{salida.cantidad}</td>
                                        <td>{formatearFecha(salida.fecha)}</td>
                                        <td>
                                            <span className="motivo-badge">{salida.motivo}</span>
                                        </td>
                                        <td>{new Date(salida.created_at).toLocaleString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => handleEliminar(salida.id)}
                                                    className="btn-delete"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {modalOpen && (
                <ModalSalida
                    productos={productos}
                    onClose={() => setModalOpen(false)}
                    onSave={handleGuardar}
                />
            )}
        </div>
    );
};

const ModalSalida = ({ productos, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        producto_id: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
        motivo: ''
    });

    const [stockDisponible, setStockDisponible] = useState(0);

    const handleProductoChange = (e) => {
        const productoId = e.target.value;
        setFormData({...formData, producto_id: productoId, cantidad: ''});
        
        const producto = productos.find(p => p.id === parseInt(productoId));
        setStockDisponible(producto ? producto.stock_actual : 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (parseInt(formData.cantidad) > stockDisponible) {
            alert(`Stock insuficiente. Stock disponible: ${stockDisponible}`);
            return;
        }
        
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Nueva Salida</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Producto:</label>
                        <select
                            value={formData.producto_id}
                            onChange={handleProductoChange}
                            required
                        >
                            <option value="">Seleccionar producto</option>
                            {productos.map(producto => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre} ({producto.sku}) - Stock: {producto.stock_actual}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.producto_id && (
                        <div className="stock-info">
                            Stock disponible: <strong>{stockDisponible}</strong>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            min="1"
                            max={stockDisponible}
                            value={formData.cantidad}
                            onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha:</label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Motivo:</label>
                        <select
                            value={formData.motivo}
                            onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                            required
                        >
                            <option value="">Seleccionar motivo</option>
                            <option value="Venta">Venta</option>
                            <option value="Ajuste de inventario">Ajuste de inventario</option>
                            <option value="Merma">Merma</option>
                            <option value="Préstamo">Préstamo</option>
                            <option value="Donación">Donación</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar Salida</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaSalidas;