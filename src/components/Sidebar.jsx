// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiPackage, 
  FiGrid, 
  FiShoppingCart,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, text: 'Inicio' },
    { path: '/dashboard/productos', icon: FiPackage, text: 'Productos' },
    { path: '/dashboard/categorias', icon: FiGrid, text: 'Categorías' },
    { path: '/dashboard/entradas', icon: FiTrendingDown, text: 'Entradas' },
    { path: '/dashboard/salidas', icon: FiTrendingUp, text: 'Salidas' },
    { path: '/dashboard/stock-bajo', icon: FiAlertCircle, text: 'Stock Bajo', badge: 3 },
    { path: '/dashboard/lista-usuario', icon: FiUsers, text: 'ListaUsuario' },
   
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <FiPackage className="logo-icon" />
          {isOpen && <span className="logo-text">Inventario</span>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            {isOpen && <span className="nav-text">{item.text}</span>}
            {isOpen && item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <FiLogOut className="nav-icon" />
          {isOpen && <span className="nav-text">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;