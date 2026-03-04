// src/components/Footer.jsx
const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="footer">
        <p className="footer-text">
          © {currentYear} Sistema de Inventario. Todos los derechos reservados.
        </p>
        <p className="footer-version">
          Versión 1.0.0
        </p>
      </footer>
    );
  };
  
  export default Footer;