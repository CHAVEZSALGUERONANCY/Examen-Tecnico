// src/layout/usuarios/ListaUsuarios.jsx
import React, { useState, useEffect } from 'react';
import userService from '../../service/UserService';
import '../../styles/pages/UsersPage.css';

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [filtroActivo, setFiltroActivo] = useState('todos'); // 'todos', 'activos', 'inactivos'
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [usuarioIdPassword, setUsuarioIdPassword] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            
            if (response.success) {
                setUsuarios(response.data);
                setError(null);
            } else {
                setError(response.error || 'Error al cargar los usuarios');
            }
        } catch (error) {
            setError('Error al cargar los usuarios');
            console.error('Error en cargarUsuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrear = () => {
        // Nota: Para crear usuarios normalmente se usa un registro, no desde aquí
        alert('Para crear un nuevo usuario, utiliza el formulario de registro');
    };

    const handleEditar = (usuario) => {
        setUsuarioActual(usuario);
        setModalOpen(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                const response = await userService.deleteUser(id);
                if (response.success) {
                    await cargarUsuarios();
                } else {
                    alert(response.error || 'Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error en handleEliminar:', error);
                alert('Error al eliminar el usuario');
            }
        }
    };

    const handleToggleStatus = async (usuario) => {
        const nuevoEstado = !usuario.activo;
        const accion = nuevoEstado ? 'activar' : 'desactivar';
        
        if (window.confirm(`¿Estás seguro de ${accion} este usuario?`)) {
            try {
                const response = await userService.toggleUserStatus(usuario.id, nuevoEstado);
                if (response.success) {
                    await cargarUsuarios();
                } else {
                    alert(response.error || `Error al ${accion} el usuario`);
                }
            } catch (error) {
                console.error(`Error en handleToggleStatus (${accion}):`, error);
                alert(`Error al ${accion} el usuario`);
            }
        }
    };

    const handleGuardar = async (usuarioData) => {
        try {
            if (usuarioActual) {
                const response = await userService.updateUser(usuarioActual.id, usuarioData);
                if (response.success) {
                    setModalOpen(false);
                    await cargarUsuarios();
                } else {
                    alert(response.error || 'Error al actualizar el usuario');
                }
            }
        } catch (error) {
            console.error('Error en handleGuardar:', error);
            alert('Error al guardar el usuario');
        }
    };

    const handleChangePasswordClick = (id) => {
        setUsuarioIdPassword(id);
        setPasswordModalOpen(true);
    };

    const handleChangePassword = async (newPassword) => {
        if (!usuarioIdPassword) return;
        
        try {
            const response = await userService.changePassword(usuarioIdPassword, newPassword);
            if (response.success) {
                alert('Contraseña actualizada exitosamente');
                setPasswordModalOpen(false);
                setUsuarioIdPassword(null);
            } else {
                alert(response.error || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error en handleChangePassword:', error);
            alert('Error al cambiar la contraseña');
        }
    };

    const filtrarUsuarios = () => {
        if (filtroActivo === 'activos') {
            return usuarios.filter(u => u.activo === true || u.activo === 1);
        } else if (filtroActivo === 'inactivos') {
            return usuarios.filter(u => u.activo === false || u.activo === 0);
        }
        return usuarios;
    };

    const usuariosFiltrados = filtrarUsuarios();

    if (loading) return <div className="loading">Cargando usuarios...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="lista-usuarios-container">
            <div className="usuarios-header">
                <h1 className="usuarios-title">Lista de Usuarios</h1>
                <div className="header-actions">
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filtroActivo === 'todos' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('todos')}
                        >
                            Todos
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'activos' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('activos')}
                        >
                            Activos
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'inactivos' ? 'active' : ''}`}
                            onClick={() => setFiltroActivo('inactivos')}
                        >
                            Inactivos
                        </button>
                    </div>
                    <button onClick={handleCrear} className="btn-primary" disabled>
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {usuariosFiltrados.length === 0 ? (
                <div className="empty-state">
                    <p>No hay usuarios {filtroActivo !== 'todos' ? filtroActivo : ''}</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id} className={!usuario.activo ? 'inactive-row' : ''}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <span className={`role-badge role-${usuario.rol?.toLowerCase() || 'usuario'}`}>
                                            {usuario.rol || 'Usuario'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${usuario.activo ? 'status-active' : 'status-inactive'}`}>
                                            {usuario.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                onClick={() => handleEditar(usuario)}
                                                className="btn-edit"
                                                title="Editar usuario"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(usuario)}
                                                className={`btn-toggle ${usuario.activo ? 'btn-deactivate' : 'btn-activate'}`}
                                                title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'}
                                            >
                                                {usuario.activo ? 'Desactivar' : 'Activar'}
                                            </button>
                                            <button 
                                                onClick={() => handleChangePasswordClick(usuario.id)}
                                                className="btn-password"
                                                title="Cambiar contraseña"
                                            >
                                                Cambiar Pass
                                            </button>
                                            <button 
                                                onClick={() => handleEliminar(usuario.id)}
                                                className="btn-delete"
                                                title="Eliminar usuario"
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
                <ModalUsuario
                    usuario={usuarioActual}
                    onClose={() => setModalOpen(false)}
                    onSave={handleGuardar}
                />
            )}

            {passwordModalOpen && (
                <ModalPassword
                    onClose={() => {
                        setPasswordModalOpen(false);
                        setUsuarioIdPassword(null);
                    }}
                    onSave={handleChangePassword}
                />
            )}
        </div>
    );
};

const ModalUsuario = ({ usuario, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        rol: usuario?.rol || 'usuario',
        activo: usuario?.activo !== undefined ? usuario.activo : true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
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
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Rol:</label>
                        <select
                            value={formData.rol}
                            onChange={(e) => setFormData({...formData, rol: e.target.value})}
                            required
                        >
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                            <option value="supervisor">Supervisor</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.activo}
                                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                            />
                            Usuario activo
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ModalPassword = ({ onClose, onSave }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        onSave(password);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Cambiar Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nueva Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            required
                            minLength="6"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Confirmar Contraseña:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError('');
                            }}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Cambiar Contraseña</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaUsuarios;