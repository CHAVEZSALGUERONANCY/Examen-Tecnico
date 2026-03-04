// src/layout/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import '../styles/dashboard.css';

const DashboardLayout = () => {
  // Inicializar abierto en pantallas grandes, cerrado en móviles
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // lock scrolling when overlay is visible
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen, isMobile]);

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={`sidebar-overlay ${sidebarOpen && isMobile ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />
      <div className="main-wrapper">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-wrapper">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;