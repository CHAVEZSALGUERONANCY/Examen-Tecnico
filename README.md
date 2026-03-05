# Sistema de Gestión de Inventario

Aplicación web para la gestión integral de inventario, productos, categorías, entradas, salidas y control de stock. Construida con React + Vite.

## Características

- ✅ Autenticación de usuarios con JWT
- ✅ Gestión de productos (CRUD completo)
- ✅ Gestión de categorías
- ✅ Control de entradas y salidas de inventario
- ✅ Alertas de stock bajo
- ✅ Perfil de usuario y gestión de usuarios
- ✅ Interfaz responsiva y amigable

---

## Requisitos No Funcionales

Los siguientes requisitos no funcionales definen las características de calidad del sistema y están diseñados para garantizar una experiencia óptima tanto para usuarios como para administradores.

### 1. Rendimiento (Performance)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Tiempo de carga inicial | < 3 segundos | La experiencia del usuario requiere respuestas rápidas para mantener la productividad. |
| Tiempo de respuesta de API | < 500ms (p95) | Operaciones frecuentes como búsquedas y listados deben sentirse instantáneas. |
| Renderizado de componentes | < 100ms | Actualizaciones de UI fluidas sin bloqueos perceptibles. |
| Optimización de bundles | Code splitting automático | Reduce el tamaño inicial de la aplicación mejorando los tiempos de carga. |

**Implementación recomendada**: 
- Uso de `React.lazy()` y `Suspense` para cargar rutas bajo demanda
- Implementación de memoización con `useMemo` y `useCallback` para componentes complejos
- Optimización de imágenes y assets estáticos
- Caché de respuestas API cuando sea apropiado

---

### 2. Escalabilidad (Scalability)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Usuarios concurrentes | Soporte para 100+ usuarios simultáneos | Permite crecimiento futuro sin degradación de servicio. |
| Volumen de datos | Listados paginados (mínimo 20 elementos por página) | Manejo eficiente de grandes volúmenes de inventario. |
| Modularidad | Arquitectura basada en componentes reutilizables | Facilita la adición de nuevas funcionalidades sin impacto en código existente. |

**Implementación recomendada**:
- Patrón de diseño modular (componentes, servicios, hooks separados)
- Paginación server-side para listados grandes
- Lazy loading de rutas y componentes pesados
- API RESTful bien estructurada para facilitar integración futura

---

### 3. Seguridad (Security)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Autenticación | JWT con tokens de acceso y expiración | Garantiza que solo usuarios autorizados accedan al sistema. |
| Almacenamiento de credenciales | Tokens almacenados de forma segura (httpOnly idealmente) | Previene ataques XSS y robo de sesiones. |
| Validación de datos | Validación tanto en cliente como servidor | Previene inyección de código y datos maliciosos. |
| Rutas protegidas | Todas las rutas de dashboard requieren autenticación | Evita acceso no autorizado a información sensible. |
| Gestión de errores | Mensajes de error genéricos para el usuario | Previene filtración de información del sistema. |

**Implementación recomendada**:
- Implementar refresh tokens para sesiones largas
- Validación de permisos a nivel de rutas y componentes
- Sanitización de inputs y outputs
- Headers de seguridad (CSP, X-Frame-Options, etc.)
- Logs de auditoría para acciones críticas

---

### 4. Usabilidad (Usability)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Diseño intuitivo | Navegación clara con sidebar y topbar | Reduce la curva de aprendizaje y errores de uso. |
| Feedback visual | Indicadores de carga, éxito y error | El usuario debe siempre saber el estado de sus acciones. |
| Accesibilidad de formularios | Labels claros, mensajes de validación en tiempo real | Facilita la corrección de errores y reduce frustración. |
| Consistencia visual | Sistema de diseño unificado (colores, tipografía, espaciado) | Crea familiaridad y confianza en la interfaz. |

**Implementación recomendada**:
- Biblioteca de componentes reutilizables
- Guías de estilo y documentación de diseño
- Tooltips y ayuda contextual
- Keyboard navigation para acciones principales
- Estados de carga (loading skeletons) durante fetches

---

### 5. Fiabilidad (Reliability)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Manejo de errores | Try-catch en operaciones asíncronas con fallback UI | La aplicación no debe "romperse" ante errores inesperados. |
| Recuperación de sesiones | Persistencia de estado de autenticación | El usuario no debe perder su sesión por refresh simple. |
| Validación de datos | Validación robusta de formularios | Previene guardar datos inconsistentes o inválidos. |
| Mensajes de error claros | Comunicación clara de qué salió mal y cómo solucionarlo | Reduce llamadas de soporte y mejora la experiencia. |

**Implementación recomendada**:
- Error boundaries en React para capturar errores de componentes
- Global error handler para API calls
- Retry logic para operaciones de red
- State management robusto (AuthContext con manejo de estados)
- Validación con bibliotecas como Yup o Zod

---

### 6. Mantenibilidad (Maintainability)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Estructura de código | Separación clara de responsabilidades (servicios, componentes, hooks, contextos) | Facilita la localización y corrección de bugs. |
| Documentación | README actualizado y comentarios en funciones complejas | Nuevos desarrolladores pueden integrarse más rápido. |
| Naming conventions | Nombres descriptivos en español/inglés consistente | El código debe ser autoexplicativo. |
| ESLint/Prettier | Configuración de linter y formateador | Mantiene consistencia en todo el codebase. |

**Implementación recomendada**:
- Estructura de carpetas basada en dominio/feature
- Componentes pequeños con responsabilidad única
- Custom hooks para lógica reutilizable
- Servicios API separados por entidad
- Archivo TODO.md para seguimiento de tareas técnicas

---

### 7. Compatibilidad (Compatibility)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Navegadores soportados | Chrome, Firefox, Edge, Safari (versiones actuales y -1) | Maximiza el alcance de usuarios. |
| Responsive design | Compatible con escritorio, tablet y móvil | Permite acceso desde cualquier dispositivo. |
| Progressive Enhancement | Funcionalidad core disponible sin JavaScript avanzado | Mejor experiencia en conexiones lentas. |
| Resolución mínima | 1024x768 para desktop | Asegura legibilidad en pantallas estándar. |

**Implementación recomendada**:
- CSS con media queries para diseño responsivo
- Framework CSS (Bootstrap) con utilities responsivas
- Testing cross-browser
- Viewport meta tag y PWA capabilities (manifest.json)
- Polyfills solo cuando sea necesario (modern JS)

---

### 8. Accesibilidad (Accessibility)

| Métrica | Requisito | Justificación |
|---------|-----------|----------------|
| Contraste de colores | Ratio mínimo 4.5:1 para texto | Garantiza legibilidad para usuarios con discapacidad visual. |
| Navegación por teclado | Todos los elementos interactivos accesibles via Tab | Usuarios que no pueden usar mouse. |
| Roles ARIA | Atributos correctos en componentes interactivos | Compatibilidad con lectores de pantalla. |
| Labels en formularios | Todos los inputs tienen labels asociados | Facilita el uso con tecnologías asistivas. |

**Implementación recomendada**:
- Seguir guía WCAG 2.1 nivel AA
- lighthouse audit para verificar compliance
- Testing con NVDA, VoiceOver o similar
- Skip links para navegación principal
- Focus visible en elementos interactivos

---

## Tecnologías y Versiones Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| React | ^19.2.0 | Biblioteca de UI principal |
| Vite | ^7.3.1 | Build tool y servidor de desarrollo |
| React Router DOM | ^7.13.1 | Navegación y rutas |
| React Bootstrap | ^2.10.10 | Componentes UI basados en Bootstrap |
| Bootstrap | ^5.3.8 | Framework CSS |
| Axios | ^1.13.6 | Cliente HTTP para API |
| Lucide React | ^0.576.0 | Iconos |
| React Icons | ^5.6.0 | Iconos adicionales |
| Feather Icons React | ^1.0.0 | Iconos |
| Simplebar React | ^3.3.2 | Scrollbars personalizables |
| ESLint | ^9.39.1 | Linting de código |
| Prettier | ^3.8.1 | Formateo de código |
| Sass | ^1.97.3 | Preprocesador CSS |

## Getting Started

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── context/          # Contextos de React (Auth)
├── hooks/            # Custom hooks
├── layout/           # Layouts y páginas
│   ├── categorias/
│   ├── configuracion/
│   ├── entradas/
│   ├── login/
│   ├── perfil/
│   ├── productos/
│   ├── salidas/
│   ├── stock/
│   └── usuarios/
├── router/           # Configuración de rutas
├── service/          # Servicios API
└── styles/           # Archivos CSS
```

---

## Licencia

MIT

