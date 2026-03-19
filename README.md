# PW2 — Práctica 2: Tienda con Svelte 5

Aplicación web fullstack con backend en **Node.js + Express + MongoDB** y frontend SPA en **Svelte 5 + Vite** (sin SvelteKit). Implementa autenticación JWT, gestión de productos y usuarios con roles, y persistencia de sesión.

---

## Índice

1. [Requisitos previos](#requisitos-previos)
2. [Instalación y arranque](#instalación-y-arranque)
3. [Usuarios de prueba](#usuarios-de-prueba)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Backend](#backend)
6. [Frontend](#frontend)
7. [Runes de Svelte 5](#runes-de-svelte-5)
8. [Endpoints de la API](#endpoints-de-la-api)
9. [Funcionalidades implementadas](#funcionalidades-implementadas)
10. [Solucion de problemas frecuentes](#Solucion-de-problemas-freceuntes)

---

## Requisitos previos

- **Node.js** 18 o superior
- **MongoDB** 7
- **Redis** 7
- **Docker Desktop** (recomendado para levantar MongoDB y Redis)

---

## Instalación y arranque

### 1. Levantar MongoDB y Redis

Con Docker (la opción más sencilla):

```bash
docker run -d -p 27017:27017 --name mongo mongo:7
docker run -d -p 6379:6379 --name redis redis:7
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edita `.env` con estos valores:

```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/productos
JWT_SECRET=secreto123
REDIS_URL=redis://localhost:6379
```

```bash
npm install
npm run seed    # Crea los usuarios admin y user iniciales
npm run dev     # Arranca en http://localhost:3000
```

Documentación Swagger disponible en: `http://localhost:3000/api-docs`

### 3. Frontend

Abre una segunda terminal:

```bash
cd frontend-svelte
npm install
npm run dev     # Arranca en http://localhost:5173
```

---

## Usuarios de prueba

| Usuario | Contraseña | Rol | Permisos |
|---|---|---|---|
| admin | admin123 | Admin | CRUD completo de productos y usuarios |
| user | user123 | Usuario | Solo lectura de productos |

Los usuarios que se registran desde la app siempre tienen rol **user**. Solo un admin puede promover a otro usuario a admin desde el panel de gestión.

---

## Estructura del proyecto

```
pw2-entrega/
├── backend/
│   ├── server.js                    Punto de entrada
│   ├── seed.js                      Datos iniciales (usuarios)
│   ├── .env.example                 Plantilla de variables de entorno
│   └── src/
│       ├── app.js                   Configuración Express
│       ├── config/
│       │   ├── db.js                Conexión MongoDB
│       │   ├── redis.js             Conexión Redis
│       │   └── swagger.js           Documentación Swagger
│       ├── controllers/
│       │   ├── authController.js    Login y registro
│       │   ├── productController.js CRUD productos
│       │   └── userController.js    CRUD usuarios
│       ├── middleware/
│       │   ├── authMiddleware.js    Verificación JWT
│       │   └── rateLimiter.js       Límite en endpoint de login
│       ├── models/
│       │   ├── Producto.js          nombre, precio, imagen, activo
│       │   └── User.js              username, password, role, cart
│       ├── routes/
│       │   ├── authRoutes.js        /login, /register
│       │   ├── productRoutes.js     /productos
│       │   └── userRoutes.js        /users
│       └── services/
│           ├── authService.js       Lógica auth + bcrypt
│           ├── productService.js    Lógica productos + caché Redis
│           └── userService.js       Lógica usuarios
│
└── frontend-svelte/
    ├── index.html
    ├── vite.config.js
    ├── svelte.config.js
    └── src/
        ├── App.svelte               Router SPA + navbar + interceptor global
        ├── main.js                  Punto de entrada (mount)
        ├── stores/
        │   └── auth.svelte.js       Estado global token+user con localStorage
        ├── services/
        │   └── api.js               Llamadas al backend
        ├── components/
        │   ├── ProductCard.svelte   Tarjeta producto (badge activo/inactivo)
        │   ├── ProductForm.svelte   Modal crear/editar con validaciones
        │   ├── ProductDetail.svelte Modal detalle producto
        │   ├── UserRow.svelte       Fila tabla de usuarios
        │   └── Toast.svelte         Notificación global
        └── pages/
            ├── Login.svelte         Inicio de sesión
            ├── Register.svelte      Registro con autologin
            ├── Products.svelte      Listado + CRUD + filtros
            ├── Users.svelte         Panel admin de usuarios
            └── Profile.svelte       Perfil + cerrar sesión
```

---

## Backend

### Tecnologías principales

- **Express** — framework HTTP
- **Mongoose** — ODM para MongoDB
- **Redis** — caché del listado de productos (TTL 60 segundos)
- **jsonwebtoken** — firma y verificación de tokens JWT
- **bcryptjs** — hash de contraseñas
- **multer** — subida de imágenes de productos
- **helmet** — cabeceras de seguridad HTTP
- **express-rate-limit** — protección contra fuerza bruta en login
- **swagger-ui-express** — documentación interactiva

### Modelos

**Producto**

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | String | Nombre del producto |
| precio | Number | Precio en euros |
| imagen | String | Nombre del archivo subido |
| activo | Boolean | Estado (por defecto true) |

**User**

| Campo | Tipo | Descripción |
|---|---|---|
| username | String | Nombre único de usuario |
| password | String | Contraseña hasheada con bcrypt |
| role | String | "admin" o "user" (por defecto "user") |
| cart | Array | Carrito: [{ productId, quantity }] |

---

## Frontend

### Tecnologías

- **Svelte 5** con runes ($state, $derived, $effect, $props)
- **Vite 6** como bundler y servidor de desarrollo
- Sin SvelteKit: navegación SPA gestionada manualmente con $state

### Flujo de autenticación

1. El usuario introduce credenciales -> POST /api/login
2. El backend devuelve un JWT firmado
3. Se decodifica el payload para extraer username, role e id
4. Token y usuario se guardan en $state global y en localStorage
5. Al recargar la página, el estado se restaura desde localStorage automáticamente
6. Al cerrar sesión, se limpian el estado y el localStorage

### Pantallas

| Pantalla | Acceso | Descripción |
|---|---|---|
| Login | Público | Inicio de sesión con JWT |
| Registro | Público | Crear cuenta (siempre rol user) con autologin |
| Productos | Autenticado | Listado, detalle, CRUD con filtros avanzados |
| Usuarios | Solo admin | Gestión completa de usuarios y roles |
| Perfil | Autenticado | Datos del usuario y cerrar sesión |

---

## Runes de Svelte 5

### $state()

Gestiona todo el estado reactivo de la aplicación.

| Archivo | Variables con $state |
|---|---|
| auth.svelte.js | token, user (inicializados desde localStorage al arrancar) |
| App.svelte | currentPage, authMode, toast |
| Products.svelte | products, loading, formLoading, search, minPrice, maxPrice, filterActivo, showForm, editingProduct, detailProduct, showFilters |
| Users.svelte | users, loading, search, showCreateForm, newUsername, newPassword, newRole, formLoading |
| ProductForm.svelte | nombre, precio, activo, imageFile, errors |
| Register.svelte | username, password, password2, error, success, loading |
| Login.svelte | username, password, error, loading |

### $derived() y $derived.by()

Valores calculados reactivamente sin peticiones adicionales al backend.

| Archivo | Variable | Descripción |
|---|---|---|
| App.svelte | user, isAdmin | Usuario activo y si es admin para personalizar la UI |
| Products.svelte | filteredProducts | Filtro combinado: nombre + precio min/max + activo ($derived.by) |
| Products.svelte | hasActiveFilters | Si hay algún filtro activo (indicador visual) |
| Products.svelte | isAdmin, totalCount, maxPriceCatalog | Rol, contador y precio máximo del catálogo |
| Users.svelte | filteredUsers, adminCount, userCount, currentUser | Usuarios filtrados y contadores por rol |
| Register.svelte | canSubmit, passwordMismatch | Validación del formulario en tiempo real |
| UserRow.svelte | isSelf | Si la fila corresponde al usuario logado |
| ProductCard.svelte | activo | Estado activo del producto |
| ProductDetail.svelte | activo | Estado activo del producto en el modal |

### $effect()

Side effects reactivos que se ejecutan cuando cambian sus dependencias.

| Archivo | Qué hace |
|---|---|
| App.svelte | Interceptor global de fetch: detecta errores 401 (cierra sesión automáticamente) y 500 (muestra toast) |
| App.svelte | Redirige al login si el token desaparece del estado |
| App.svelte | Redirige a productos si un usuario sin rol admin intenta acceder a /users |
| Products.svelte | Carga inicial de productos al montar el componente |
| Users.svelte | Carga inicial de usuarios al montar el componente |

### $props()

Todos los componentes definen sus props con $props() y comunican acciones al padre mediante callbacks en lugar de eventos personalizados.

| Componente | Props recibidas | Callbacks al padre |
|---|---|---|
| ProductCard | product, isAdmin | onEdit(product), onDelete(id), onDetail(product) |
| ProductForm | product, loading | onSave(formData, id), onCancel() |
| ProductDetail | product | onClose() |
| UserRow | user, currentUserId | onChangeRole(id, role), onDelete(id, username) |
| Toast | message, type | onClose() |
| Products | — | onToast(msg, type) |
| Users | — | onToast(msg, type) |
| Login | — | onLogin(), onGoRegister() |
| Register | — | onGoLogin(), onRegistered() |
| Profile | — | onLogout() |

---

## Endpoints de la API

Base URL: `http://localhost:3000/api`

### Autenticación (público)

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | /login | { username, password } | { token } |
| POST | /register | { username, password } | { message } |

### Productos

| Método | Ruta | Auth | Rol | Body / Query |
|---|---|---|---|---|
| GET | /productos | No | — | Query: ?name=texto |
| POST | /productos | Sí | Admin | multipart: nombre, precio, activo, imagen |
| PUT | /productos/:id | Sí | Admin | JSON: { nombre, precio, activo } |
| DELETE | /productos/:id | Sí | Admin | — |

### Usuarios

| Método | Ruta | Auth | Rol | Body |
|---|---|---|---|---|
| GET | /users | Sí | Admin | — |
| POST | /users | Sí | Admin | { username, password, role } |
| PUT | /users/:id | Sí | Admin | { username, role, password? } |
| DELETE | /users/:id | Sí | Admin | — |

---

## Funcionalidades implementadas

### Requisitos mínimos (5 puntos)

- Proyecto Vite + Svelte 5 sin SvelteKit, organizado en components, pages, services, stores
- Login con JWT, gestión de errores de credenciales, token almacenado en memoria
- Registro de nuevos usuarios con autologin automático al completar el registro
- Pantallas privadas completamente inaccesibles sin sesión activa
- Listado de productos mostrando nombre, precio y estado activo/inactivo
- Detalle de producto en modal con toda la información
- Creación de producto con imagen (solo admin)
- Edición y borrado de producto con confirmación (solo admin)
- Navegación SPA entre 5 pantallas con pantalla activa resaltada en la barra de navegación
- Diseño responsive que se adapta a móvil

### Runes de Svelte 5 (+3 puntos)

- $state() para todo el estado global y local de la aplicación
- $derived() y $derived.by() para filtros combinados y valores calculados sin recargar el backend
- $effect() para carga de datos, redirecciones y el interceptor global de errores de red
- $props() con callbacks en todos los componentes en lugar de eventos personalizados

### Funcionalidades avanzadas (+2 puntos)

- Gestión de usuarios y roles: panel exclusivo para admin, listado de usuarios, cambio de rol (promover/degradar), alta y baja de usuarios. Botones de editar/borrar en productos visibles solo para admin.
- Persistencia de sesión: JWT guardado en localStorage, estado restaurado al recargar con $state inicializado desde el almacenamiento, logout limpia estado y storage correctamente.
- Filtros combinados: búsqueda por nombre, precio mínimo, precio máximo y estado activo/inactivo, todos calculados con $derived.by() sin peticiones extra al backend. Indicador visual de filtros activos y botón para limpiarlos.
- Manejo avanzado de formularios: validaciones de campos obligatorios, formatos y rangos, mensajes de error inline, botones deshabilitados mientras se guardan cambios.
- Experiencia de usuario mejorada: skeletons de carga, toasts de éxito y error, confirmación antes de cualquier acción destructiva, interceptor global con $effect para errores 401/403/500, autologin tras registro.

---

## Solución de problemas frecuentes

### Error al instalar dependencias (conflicto de versiones npm)

Si `npm install` falla con un error `ERESOLVE unable to resolve dependency tree`, borra la caché y las dependencias instaladas antes de volver a intentarlo.

**En el backend:**

```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
```

**En el frontend:**

```bash
cd frontend-svelte
rmdir /s /q node_modules
del package-lock.json
npm install
```

Si sigue fallando después de borrar, usa el flag que ignora conflictos de versiones entre paquetes:

```bash
npm install --legacy-peer-deps
```

> Nota: los comandos `rmdir /s /q` y `del` son para **Windows** (cmd o PowerShell).
> En macOS/Linux usa `rm -rf node_modules package-lock.json` en su lugar.

---

### Error de conexión a Redis: `getaddrinfo ENOTFOUND redis`

Este error aparece cuando el backend intenta conectarse a Redis usando el hostname `redis` (nombre de contenedor Docker interno) en lugar de `localhost`.

**Solución — editar el archivo `.env`:**

Abre `backend/.env` y añade o edita la línea de Redis:

```
REDIS_URL=redis://localhost:6379
```

Guarda el archivo. Nodemon reiniciará el servidor automáticamente y deberías ver `Redis Client Ready` en la terminal.

**Solución alternativa — editar directamente el archivo de configuración:**

Si no quieres tocar el `.env`, abre `backend/src/config/redis.js` y cambia:

```js
// Antes
url: process.env.REDIS_URL || 'redis://redis:6379'

// Después
url: process.env.REDIS_URL || 'redis://localhost:6379'
```

Guarda y nodemon reiniciará solo.
