# Backend - Sistema de Gestión de Inventario

API RESTful para la gestión de inventario con autenticación JWT, control de roles y seguimiento de productos.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Versiones del Software](#versiones-del-software)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [API Endpoints](#api-endpoints)
- [Arquitectura](#arquitectura)
- [Requisitos No Funcionales](#requisitos-no-funcionales)
- [Licencia](#licencia)

---

## Descripción

Backend desenvolvido con Node.js y Express para un sistema de gestión de inventario que permite:
- Gestión de usuarios con autenticación JWT
- Control de inventario de productos
- Registro de entradas y salidas de mercancía
- Control de stock mínimo por producto

---

## Tecnologías

| Tecnología | Propósito                 |
|------------|---------------------------|
| Node.js    | Entorno de ejecución          v22.22.0|
| Express    | Framework web             |
| MySQL      | Base de datos relacional  |
| JWT        | Autenticación por tokens  |
| bcrypt     | Hasheo de contraseñas     |
| dotenv     | Variables de entorno      |
| cors       | Cross-Origin Resource Sharing |
------------------------------------------

## Versiones del Software

### Dependencias de Producción

| Paquete      | Versión   | Propósito                                    |
|--------------|-----------|----------------------------------------------|
| express      | ^5.2.1    | Framework web para API REST                  |
| mysql2       | ^3.18.2   | Driver MySQL con soporte a promises          |
| jsonwebtoken | ^9.0.3    | Generación y verificación de tokens JWT      |
| bcrypt       | ^6.0.0    | Hasheo de contraseñas con salt               |
| dotenv       | ^17.3.1   | Carga de variables de entorno                |
| cors         | ^2.8.6    | Habilitación de CORS para consumo cruzado    |

### Dependencias de Desarrollo

| Paquete  | Versión   | Propósito                          |
|----------|-----------|-------------------------------------|
| nodemon  | ^3.1.14   | Reinicio automático del servidor   |

### Versión de Node.js Requerida

| Requisito      | Versión Mínima |
|----------------|----------------|
| Node.js        | v14.x o superior |
| npm            | v6.x o superior |

### Base de Datos

| Software    | Versión Mínima |
|-------------|----------------|
| MySQL       | 5.7 o superior |

---

**Nota:** Las versiones indicadas con `^` indican que se acepta cualquier versión compatible superior según semver.

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Modo desarrollo (con nodemon)
npm run dev
```

---

## Configuración

Crear archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_db

# JWT
JWT_SECRET=tu_secret_key_muy_segura
JWT_EXPIRES=24h
```

---

## API Endpoints

### Autenticación (Públicas)
| Método | Endpoint             | Descripción        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/login`    | Iniciar sesión     |
| POST   | `/api/auth/register` | Registrar usuario  |
| GET    | `/api/auth/verify`   | Verificar token    |
| POST   | `/api/auth/refresh`  | Refrescar token    |
| POST   | `/api/auth/logout`   | Cerrar sesión      |
------------------------------------------------------

### Usuarios (Protegidas - Admin)
| Método | Endpoint            | Descripción        |
|--------|---------------------|--------------------|
| GET    | `/api/usuarios`     | Listar usuarios    |
| GET    | `/api/usuarios/:id` | Obtener usuario    |
| POST   | `/api/usuarios`     | Crear usuario      |
| PUT    | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario   |
-----------------------------------------------------

### Categorías (Protegidas)
| Método |    Endpoint           | Descripción          |
|--------|-----------------------|----------------------|
| GET    | `/api/categorias`     | Listar categorías    |
| GET    | `/api/categorias/:id` | Obtener categoría    |
| POST   | `/api/categorias`     | Crear categoría      |
| PUT    | `/api/categorias/:id` | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría   |

### Productos (Protegidas)
| Método | Endpoint                       | Descripción         |
|--------|--------------------------------|---------------------|
| GET    | `/api/productos`               | Listar productos    |
| GET    | `/api/productos/:id`           | Obtener producto    |
| GET    | `/api/productos/search?q=term` | Buscar productos    |
| POST   | `/api/productos`               | Crear producto      |
| PUT    | `/api/productos/:id`           | Actualizar producto |
| DELETE | `/api/productos/:id`           | Eliminar producto   |

### Entradas (Protegidas)
| Método | Endpoint            | Descripción      |
|--------|---------------------|------------------|
| GET    | `/api/entradas`     | Listar entradas  |
| GET    | `/api/entradas/:id` | Obtener entrada  |
| POST   | `/api/entradas`     | Registrar entrada|
| DELETE | `/api/entradas/:id` | Eliminar entrada |

### Salidas (Protegidas)
| Método | Endpoint           | Descripción      |
|--------|--------------------|------------------|
| GET    | `/api/salidas`     | Listar salidas   |
| GET    | `/api/salidas/:id` | Obtener salida   |
| POST   | `/api/salidas`     | Registrar salida |
| DELETE | `/api/salidas/:id` | Eliminar salida  |

### Inventario
| Método | Endpoint                        | Descripción                 |
|--------|---------------------------------|-----------------------------|
| GET    | `/api/inventario`               | Ver inventario completo     |
| GET    | `/api/inventario/producto/:id`  | Stock de un producto        |
| GET    | `/api/inventario/bajo-stock`    | Productos bajo stock mínimo |

---

## Arquitectura

```
src/
├── app.js              # Configuración de Express
├── config/
│   ├── db.js           # Conexión a MySQL con pooling
│   └── initTables.js   # Inicialización de tablas
├── controllers/        # Lógica de negocio
├── middleware/
│   └── auth.js         # Autenticación JWT y roles
├── models/             # Acceso a datos
└── routes/             # Definición de endpoints
```

**Patrón MVC:**
- **Model:** Interacción con MySQL usando prepared statements
- **View:** API JSON
- **Controller:** Lógica de negocio

---

## Requisitos No Funcionales

### 1. Seguridad

**Justificación:** La aplicación maneja información sensible de inventario y credenciales de usuarios, por lo que la seguridad es crítica.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **Autenticación JWT** | Tokens JWT con expiración configurable (default 24h) | Permite autenticación stateless escalable sin almacenamiento de sesión en servidor |
| **Hasheo de contraseñas** | bcrypt con salt de 10 rounds | Protege contraseñas incluso si la base de datos es comprometida |
| **Control de acceso basado en roles (RBAC)** | Roles: `admin` y `usuario` | Permite restringir operaciones sensibles solo a administradores |
| **Protección de rutas** | Middleware `authMiddleware` en todas las rutas excepto auth | Previene acceso no autorizado a recursos protegidos |
| **SQL Injection Prevention** | Prepared statements en todas las consultas | Previene inyección SQL validando y escapando parámetros |
| **CORS** | Configuración de CORS permitida | Permite controlar qué dominios pueden acceder a la API |

### 2. Rendimiento

**Justificación:** El sistema debe manejar múltiples operaciones de inventario concurrentes eficientemente.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **Connection Pooling** | MySQL pool con 10 conexiones máximas | Evita sobrecarga de conexiones, reutiliza conexiones y mejora throughput |
| **Consultas optimizadas** | JOINs en lugar de múltiples queries | Reduce el número de consultas a la base de datos |
| **Índices implícitos** | Campos como `email`, `sku`, `activo` en WHERE | Mejora velocidad de búsqueda en tablas frecuentes |
| **Soft Deletes** | Campo `activo` en lugar de DELETE físico | Mantiene integridad referencial y permite auditoría |

### 3. Escalabilidad

**Justificación:** La arquitectura debe permitir crecimiento sin cambios mayores.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **Arquitectura modular MVC** | Separación clara de responsabilidades | Facilita adicionar nuevas funcionalidades sin afectar otras |
| **Diseño RESTful** | Recursos con verbs HTTP apropiados | Permite agregar caches, load balancers y servicios adicionales |
| **Configuración por entorno** | Variables de entorno (.env) | Facilita deployment en diferentes ambientes |
| **Middleware reutilizable** | authMiddleware separando autenticación | Agregar nuevas rutas protegidas es transparente |

### 4. Mantenibilidad

**Justificación:** El código debe ser fácil de entender, modificar y extender.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **Estructura MVC clara** | Separación models/controllers/routes | Código organizado y predecible |
| **命名 coherente** | Nombres en español para rutas, inglés para código | Consistencia entre configuración y lógica |
| **Logging** | Console logs en cada request y error | Facilita debugging y monitoreo |
| **Manejo de errores centralizado** | Try-catch en controllers | Errores predecibles y respuestas consistentes |
| **Documentación de endpoints** | Respuesta en `/api` con todos los endpoints | Auto-documentación para desarrolladores |

### 5. Confiabilidad

**Justificación:** El sistema debe funcionar correctamente bajo condiciones adversas.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **Validación de entrada** | Verificación de campos requeridos | Previene datos inválidos en la base de datos |
| **Manejo de errores** | Try-catch con respuestas HTTP apropiadas | Evita que errores crashen el servidor |
| **Health check** | Endpoint `/api/health` | Permite monitoreo de disponibilidad |
| **Inicialización de BD** | auto-create tables al iniciar | Garantiza estructura de datos disponible |
| **Validación de tokens** | Verificación de expiración y remember_token | Previene uso de tokens robados o expirados |

### 6. Usabilidad

**Justificación:** La API debe ser intuitiva para los consumidores.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **RESTful URLs** | Recursos claros: `/api/productos`, `/api/entradas` | Intuitivo para cualquier desarrollador |
| **Códigos HTTP apropiados** | 200 (OK), 201 (Created), 401 (Unauthorized), 404 (Not Found), 500 (Error) | Estándar que facilita manejo de respuestas |
| **Mensajes de error claros** |JSON con `message` descriptivo | Facilita debugging en frontend |
| **Soporte múlti formato** | Body, query params para login/register | Flexibilidad para diferentes clientes |

### 7. Compatibilidad

**Justificación:** Debe integrarse con diferentes sistemas y versiones.

| Requisito | Implementación | Justificación |
|-----------|----------------|----------------|
| **API JSON** | Formato universal de intercambio | Compatible con cualquier cliente (web, mobile, desktop) |
| **CORS habilitado** | Middleware cors configurado | Permite consumo desde diferentes dominios |
| **Sin dependencias de versión de SO** | Node.js multiplataforma | Deploy en Windows, Linux, macOS |
| **Tokens remember_token** | Persistencia de sesión en BD | Compatible con apps que necesitan sesión larga |

---

## Licencia

ISC

