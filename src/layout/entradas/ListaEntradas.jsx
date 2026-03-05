import React, { useState, useEffect } from 'react';
import { getAll as getEntradas, getByDateRange, create as createEntrada, deleteEntrada } from '../../service/entradasService';
import { getAll as getProductos } from '../../service/productService';
import '../../styles/pages/ListaEntradas.css';

const ListaEntradas = () => {
    const [entradas, setEntradas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filtroFecha, setFiltroFecha] = useState({ inicio: '', fin: '' });
    const [filtroActivo, setFiltroActivo] = useState(false);

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        try {
            setLoading(true);
            await Promise.all([
                cargarEntradas(),
                cargarProductos()
            ]);
            setError(null);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cargarEntradas = async () => {
        try {
            const data = await getEntradas();
            setEntradas(data);
        } catch (err) {
            console.error('Error al cargar entradas:', err);
            throw err;
        }
    };

    const cargarProductos = async () => {
        try {
            const data = await getProductos();
            setProductos(data);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            throw err;
        }
    };

    const handleFiltrarPorFecha = async (e) => {
        e.preventDefault();
        if (!filtroFecha.inicio || !filtroFecha.fin) {
            alert('Debes seleccionar ambas fechas');
            return;
        }

        try {
            setLoading(true);
            const data = await getByDateRange(filtroFecha.inicio, filtroFecha.fin);
            setEntradas(data);
            setFiltroActivo(true);
            setError(null);
        } catch (err) {
            setError('Error al filtrar por fechas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiarFiltro = async () => {
        setFiltroFecha({ inicio: '', fin: '' });
        setFiltroActivo(false);
        await cargarEntradas();
    };

    const handleCrear = () => {
        setModalOpen(true);
    };

    const handleGuardar = async (entradaData) => {
        try {
            await createEntrada(entradaData);
            setModalOpen(false);
            if (filtroActivo) {
                await handleLimpiarFiltro();
            } else {
                await cargarEntradas();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar la entrada');
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta entrada?')) {
            try {
                await deleteEntrada(id);
                if (filtroActivo) {
                    await handleLimpiarFiltro();
                } else {
                    await cargarEntradas();
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Error al eliminar la entrada');
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

    if (loading && entradas.length === 0) return <div className="loading">Cargando entradas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="lista-entradas-container">
            <div className="entradas-header">
                <h1 className="entradas-title">Lista de Entradas</h1>
                <button onClick={handleCrear} className="btn-primary">
                    Nueva Entrada
                </button>
            </div>

            {/* Filtro por fechas */}
            <div className="filtro-container">
                <form onSubmit={handleFiltrarPorFecha} className="filtro-form">
                    <div className="filtro-group">
                        <label>Fecha Inicio:</label>
                        <input
                            type="date"
                            value={filtroFecha.inicio}
                            onChange={(e) => setFiltroFecha({...filtroFecha, inicio: e.target.value})}
                            required={filtroActivo}
                        />
                    </div>
                    <div className="filtro-group">
                        <label>Fecha Fin:</label>
                        <input
                            type="date"
                            value={filtroFecha.fin}
                            onChange={(e) => setFiltroFecha({...filtroFecha, fin: e.target.value})}
                            required={filtroActivo}
                        />
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

            {entradas.length === 0 ? (
                <div className="empty-state">
                    <p>
                        {filtroActivo 
                            ? 'No hay entradas en el rango de fechas seleccionado' 
                            : 'No hay entradas registradas'}
                    </p>
                    <button onClick={handleCrear} className="btn-primary">
                        Registrar primera entrada
                    </button>
                </div>
            ) : (
                <>
                    {filtroActivo && (
                        <div className="filtro-info">
                            Mostrando entradas del {formatearFecha(filtroFecha.inicio)} al {formatearFecha(filtroFecha.fin)}
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
                                    <th>Nota</th>
                                    <th>Registrado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entradas.map((entrada) => (
                                    <tr key={entrada.id}>
                                        <td>{entrada.id}</td>
                                        <td>
                                            <div className="producto-info">
                                                <span className="producto-nombre">
                                                    {entrada.producto_nombre || getNombreProducto(entrada.producto_id)}
                                                </span>
                                                {entrada.sku && (
                                                    <span className="producto-sku">SKU: {entrada.sku}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="cantidad">{entrada.cantidad}</td>
                                        <td>{formatearFecha(entrada.fecha)}</td>
                                        <td>{entrada.nota || '-'}</td>
                                        <td>{new Date(entrada.created_at).toLocaleString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => handleEliminar(entrada.id)}
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
                <ModalEntrada
                    productos={productos}
                    onClose={() => setModalOpen(false)}
                    onSave={handleGuardar}
                />
            )}
        </div>
    );
};

const ModalEntrada = ({ productos, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        producto_id: '',
        cantidad: '',
        fecha: new Date().toISOString().split('T')[0],
        nota: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Nueva Entrada</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Producto:</label>
                        <select
                            value={formData.producto_id}
                            onChange={(e) => setFormData({...formData, producto_id: e.target.value})}
                            required
                        >
                            <option value="">Seleccionar producto</option>
                            {productos.map(producto => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre} ({producto.sku})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            min="1"
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
                        <label>Nota (opcional):</label>
                        <textarea
                            value={formData.nota}
                            onChange={(e) => setFormData({...formData, nota: e.target.value})}
                            rows="3"
                            placeholder="Observaciones adicionales..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar Entrada</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaEntradas;

