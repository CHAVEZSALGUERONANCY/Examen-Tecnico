import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Estilos globales y layout
import './styles/global.css';
import './styles/layout.css';

// Estilos de componentes
import './styles/components/Sidebar.css';
import './styles/components/Header.css';
import './styles/components/Card.css';

// Estilos de páginas
import './styles/pages/HomePage.css';
import './styles/pages/UsersPage.css';
import './styles/pages/Login.css';
import './styles/pages/Register.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);