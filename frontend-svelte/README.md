# PW2 Frontend — Svelte 5

Frontend SPA para la práctica PW2, construido con **Vite + Svelte 5**.

## Requisitos previos

- Node.js 18+
- Backend corriendo en `http://localhost:3000`

## Instalación y arranque

### 1. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tu MONGO_URI y JWT_SECRET
npm install
npm run seed   # Crea usuarios admin/user
npm run dev
```

### 2. Frontend

```bash
cd frontend-svelte
npm install
npm run dev
```

Accede en: `http://localhost:5173`

Usuarios de prueba:
- `admin` / `admin123` → rol admin (CRUD completo)
- `user` / `user123` → rol user (solo lectura)

---

## Estructura del proyecto

```
src/
├── stores/
│   └── auth.svelte.js     # Estado global con $state
├── services/
│   └── api.js             # Llamadas al backend
├── components/
│   ├── ProductCard.svelte  # Tarjeta de producto ($props + callbacks)
│   ├── ProductForm.svelte  # Formulario crear/editar ($props + callbacks)
│   ├── ProductDetail.svelte# Modal detalle ($props)
│   └── Toast.svelte        # Notificación global ($props)
├── pages/
│   ├── Login.svelte        # Pantalla de login
│   ├── Products.svelte     # Listado + CRUD productos
│   └── Profile.svelte      # Perfil del usuario
└── App.svelte              # Raíz: enrutamiento + navbar
```

---

## Runes de Svelte 5 utilizadas

| Rune | Dónde | Para qué |
|---|---|---|
| `$state()` | `auth.svelte.js`, `Login`, `Products`, `Profile`, `App`, `ProductForm` | Estado reactivo: token/user, formularios, lista de productos, página actual, toast |
| `$derived()` | `Products.svelte` (filteredProducts, isAdmin), `App.svelte` (user), `Profile.svelte` (user) | Valores calculados sin efecto secundario |
| `$effect()` | `Products.svelte` (carga inicial), `App.svelte` (redirección si no autenticado) | Side-effects: fetch al montar, guardia de ruta |
| `$props()` | `ProductCard`, `ProductForm`, `ProductDetail`, `Toast`, `Products`, `Profile`, `Login` | Props tipadas en todos los componentes |

---

## Endpoints del backend utilizados

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/login` | No | Login, devuelve JWT |
| GET | `/api/productos` | No | Listado (filtro por nombre) |
| POST | `/api/productos` | Admin | Crear producto (multipart) |
| PUT | `/api/productos/:id` | Admin | Editar producto |
| DELETE | `/api/productos/:id` | Admin | Eliminar producto |

---

## Funcionalidades implementadas (requisitos mínimos)

- ✅ Proyecto Vite + Svelte 5 con organización en carpetas
- ✅ Login con JWT, gestión de errores, token en memoria
- ✅ Rutas privadas: sin token no se ven pantallas privadas
- ✅ Listado de productos con nombre y precio
- ✅ Detalle de producto en modal
- ✅ Creación de producto con imagen (admin)
- ✅ Edición de producto (admin)
- ✅ Borrado con confirmación (admin)
- ✅ Navegación SPA: Login → Productos → Perfil
- ✅ Pantalla activa resaltada en la barra de navegación
- ✅ Diseño responsive (mobile-friendly)
- ✅ Skeletons de carga, toasts de éxito/error
