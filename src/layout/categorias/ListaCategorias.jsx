import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll as getCategorias, deleteCategoria, create as createCategoria, update as updateCategoria } from '../../service/categoriaService';
import '../../styles/pages/ListaCategorias.css';

const ListaCategorias = () => {
    const navigate = useNavigate()
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoriaActual, setCategoriaActual] = useState(null);

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            setLoading(true);
            const data = await getCategorias();
            setCategorias(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las categorías');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = () => {
        setCategoriaActual(null);
        setModalOpen(true);
    };

    const handleEditar = (categoria) => {
        setCategoriaActual(categoria);
        setModalOpen(true);
    };

    const handleVer = (categoria) => {
        navigate(`/dashboard/categorias/editar/${categoria.id}`);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await deleteCategoria(id);
                await cargarCategorias();
            } catch (err) {
                alert(err.response?.data?.message || 'Error al eliminar la categoría');
            }
        }
    };

    const handleGuardar = async (categoriaData) => {
        try {
            if (categoriaActual) {
                await updateCategoria(categoriaActual.id, categoriaData);
            } else {
                await createCategoria(categoriaData);
            }
            setModalOpen(false);
            await cargarCategorias();
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar la categoría');
        }
    };

    

    if (loading) return <div className="loading">Cargando categorías...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="lista-categorias-container">
            <div className="categorias-header">
                <h1 className="categorias-title">Lista de Categorías</h1>
                <button onClick={handleCrear} className="btn-primary">
                    <span className="btn-icon">+</span>
                    <span className="btn-text">Nueva Categoría</span>
                </button>
            </div>

            {categorias.length === 0 ? (
                <div className="empty-state">
                    <p>No hay categorías creadas</p>
                    <button onClick={handleCrear} className="btn-primary">
                        Crear primera categoría
                    </button>
                </div>
            ) : (
                <>
                    {/* Vista móvil - Tarjetas */}
                    <div className="categorias-grid-mobile">
                        {categorias.map((categoria) => (
                            <div key={categoria.id} className="categoria-card">
                                <div className="card-header">
                                    <span className="card-id">#{categoria.id}</span>
                                    <h3 className="card-title">{categoria.nombre}</h3>
                                </div>
                                <p className="card-description">
                                    {categoria.descripcion || 'Sin descripción'}
                                </p>
                                <div className="card-actions">
                                    <button 
                                        onClick={() => handleVer(categoria)}
                                        className="btn-view action-btn-view"
                                    >
                                        Ver
                                    </button>
                                    <button 
                                        onClick={() => handleEditar(categoria)}
                                        className="btn-edit action-btn-edit"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleEliminar(categoria.id)}
                                        className="btn-delete action-btn-delete"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vista tablet/desktop - Tabla */}
                    <div className="table-wrapper">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map((categoria) => (
                                        <tr key={categoria.id}>
                                            <td data-label="ID">{categoria.id}</td>
                                            <td data-label="Nombre">{categoria.nombre}</td>
                                            <td data-label="Descripción">{categoria.descripcion || '-'}</td>
                                            <td data-label="Acciones">
                                                <div className="action-buttons">
                                                    <button 
                                                        onClick={() => handleVer(categoria)}
                                                        className="btn-view action-btn-view"
                                                        title="Ver detalles"
                                                    >
                                                        Ver
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditar(categoria)}
                                                        className="btn-edit action-btn-edit"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEliminar(categoria.id)}
                                                        className="btn-delete action-btn-delete"
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
                    </div>
                </>
            )}

            {modalOpen && (
                <ModalCategoria
                    categoria={categoriaActual}
                    onClose={() => setModalOpen(false)}
                    onSave={handleGuardar}
                />
            )}
        </div>
    );
};

const ModalCategoria = ({ categoria, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: categoria?.nombre || '',
        descripcion: categoria?.descripcion || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            id="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            required
                            placeholder="Ingrese el nombre de la categoría"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            rows="3"
                            placeholder="Ingrese una descripción (opcional)"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaCategorias;