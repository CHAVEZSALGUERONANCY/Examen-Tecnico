import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll as getCategorias, deleteCategoria, create as createCategoria, update as updateCategoria } from '../../service/categoriaService';
import '../../styles/pages/ListaCategorias.css';

const ListaCategorias = () => {
    const navigate = useNavigate();
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
                    Nueva Categoría
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
                                    <td>{categoria.id}</td>
                                    <td>{categoria.nombre}</td>
                                    <td>{categoria.descripcion || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                onClick={() => handleVer(categoria)}
                                                className="btn-view"
                                            >
                                                Ver
                                            </button>
                                            <button 
                                                onClick={() => handleEditar(categoria)}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleEliminar(categoria.id)}
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
                <h2>{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción:</label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            rows="3"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaCategorias;

