// src/components/Topbar.jsx
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { Link  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ toggleSidebar }) => {
  const { user,  } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <h2 className="page-title">Dashboard</h2>
      </div>
      
      <div className="topbar-right">
        <button className="notification-btn">
          <FiBell />
          <span className="notification-badge">3</span>
        </button>
        
        
        <Link to="/dashboard/perfil/" className="user-menu">
          <FiUser className="user-icon" />
          <span className="user-name">{user?.nombre || user?.email || 'Usuario'}</span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;