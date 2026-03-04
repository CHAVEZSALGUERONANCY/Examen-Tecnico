// src/router/routes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../layout/login/Login";
import Register from "../layout/login/Register";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

// imports de Productos
import ListaCatalogo from "../layout/productos/ListaCatalogo";
import CrearCatalogo from "../layout/productos/CrearCatalogo";
import EditarCatalogo from "../layout/productos/EditarCatalogo";
import DetalleCatalogo from "../layout/productos/DetalleCatalogo";

import ListaCategorias from "../layout/categorias/ListaCategorias";
import EditarCategoria from "../layout/categorias/EditarCategoria";
import Entradas from "../layout/entradas/ListaEntradas";
import Salidas from "../layout/salidas/ListaSalidas";
import StockBajo from "../layout/stock/StockBajo";
import EditarStock from "../layout/stock/EditarStock";
import Usuarios from "../layout/usuarios/Profile";
import Perfil from "../layout/usuarios/Profile";
import ListaUsuarios from "../layout/usuarios/ListaUsuarios";

import Configuracion from "../layout/configuracion/Configuracion";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="productos" replace />} />
          <Route path="productos" element={<ListaCatalogo />} />
          <Route path="productos/crear" element={<CrearCatalogo />} />
          <Route path="productos/editar/:id" element={<EditarCatalogo />} />
          <Route path="productos/:id" element={<DetalleCatalogo />} />
          <Route path="categorias" element={<ListaCategorias />} />
          <Route path="categorias/editar/:id" element={<EditarCategoria />} />
          <Route path="entradas" element={<Entradas />} />
          <Route path="salidas" element={<Salidas />} />
<Route path="stock-bajo" element={<StockBajo />} />
          <Route path="stock/editar/:id" element={<EditarStock />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="lista-usuario" element={<ListaUsuarios />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* Ruta para manejar 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;