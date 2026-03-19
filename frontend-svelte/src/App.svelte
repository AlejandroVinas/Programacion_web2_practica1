<script>
  import { isAuthenticated, clearAuth, getUser } from './stores/auth.svelte.js';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Products from './pages/Products.svelte';
  import Profile from './pages/Profile.svelte';
  import Users from './pages/Users.svelte';
  import Toast from './components/Toast.svelte';

  // $effect: interceptor global de fetch para manejar errores 401/403/500
  $effect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401 && isAuthenticated()) {
        clearAuth();
        showToast('Sesión expirada. Vuelve a iniciar sesión.', 'error');
      } else if (response.status === 500) {
        showToast('Error interno del servidor (500)', 'error');
      }
      return response;
    };
    return () => { window.fetch = originalFetch; }; // cleanup
  });

  // $state: página activa, modo de auth (login/register), toast global
  let currentPage = $state('products');
  let authMode = $state('login'); // 'login' | 'register'
  let toast = $state(null);
  let toastTimer = null;

  // $derived: usuario logado y su rol para personalizar la UI
  let user = $derived(getUser());
  let isAdmin = $derived(user?.role === 'admin');

  // $effect: si el token desaparece (logout o expiración), volver al login
  $effect(() => {
    if (!isAuthenticated()) {
      currentPage = 'products';
      authMode = 'login';
    }
  });

  // $effect: si un usuario normal intenta acceder a /users, redirigir
  $effect(() => {
    if (isAuthenticated() && currentPage === 'users' && !isAdmin) {
      currentPage = 'products';
      showToast('Acceso restringido a administradores', 'error');
    }
  });

  function navigate(page) { currentPage = page; }

  function handleLogin() { authMode = 'login'; currentPage = 'products'; }
  function handleLogout() { clearAuth(); authMode = 'login'; }
  function handleRegistered() { currentPage = 'products'; }

  function showToast(message, type = 'info') {
    if (toastTimer) clearTimeout(toastTimer);
    toast = { message, type };
    toastTimer = setTimeout(() => { toast = null; }, 3500);
  }
</script>

{#if !isAuthenticated()}
  <!-- Pantallas públicas: login y registro -->
  {#if authMode === 'login'}
    <Login onLogin={handleLogin} onGoRegister={() => authMode = 'register'} />
  {:else}
    <Register onGoLogin={() => authMode = 'login'} onRegistered={handleRegistered} />
  {/if}

{:else}
  <!-- App privada -->
  <div class="app-layout">

    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-mark">PW2</span>
        <span class="brand-name">Tienda</span>
      </div>

      <div class="nav-links">
        <button
          class="nav-link" class:active={currentPage === 'products'}
          onclick={() => navigate('products')}
        >Productos</button>

        {#if isAdmin}
          <button
            class="nav-link" class:active={currentPage === 'users'}
            onclick={() => navigate('users')}
          >Usuarios</button>
        {/if}

        <button
          class="nav-link" class:active={currentPage === 'profile'}
          onclick={() => navigate('profile')}
        >Perfil</button>
      </div>

      <div class="nav-user">
        <span class="user-chip">
          <span class="user-dot"></span>
          <!-- $derived: nombre del usuario en la cabecera -->
          {user?.username}
          {#if isAdmin}
            <span class="role-badge">admin</span>
          {/if}
        </span>
      </div>
    </nav>

    <main class="main-content">
      {#if currentPage === 'products'}
        <Products onToast={showToast} />
      {:else if currentPage === 'users' && isAdmin}
        <Users onToast={showToast} />
      {:else if currentPage === 'profile'}
        <Profile onLogout={handleLogout} />
      {/if}
    </main>

  </div>
{/if}

{#if toast}
  <Toast message={toast.message} type={toast.type} onClose={() => toast = null} />
{/if}

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(:root) {
    --bg: #0e0f11;
    --surface: #161719;
    --surface-alt: #1e2023;
    --border: #2a2c30;
    --text: #f0f0f0;
    --text-muted: #888;
    --accent: #e05a2b;
    --danger: #e03b2b;
    font-size: 16px;
  }
  :global(body) {
    background: var(--bg); color: var(--text);
    font-family: 'DM Sans', sans-serif; min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .app-layout { display: flex; flex-direction: column; min-height: 100vh; }
  .navbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 56px; background: var(--surface);
    border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; gap: 1rem;
  }
  .nav-brand { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
  .brand-mark {
    background: var(--accent); color: #fff; font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 0.75rem; letter-spacing: 0.12em; padding: 0.25rem 0.5rem;
  }
  .brand-name {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
    color: var(--text); letter-spacing: 0.02em;
  }
  .nav-links { display: flex; gap: 0.25rem; }
  .nav-link {
    background: none; border: none; color: var(--text-muted);
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    padding: 0.4rem 0.9rem; cursor: pointer; border-radius: 2px;
    transition: color 0.15s, background 0.15s; position: relative;
  }
  .nav-link:hover { color: var(--text); background: var(--surface-alt); }
  .nav-link.active { color: var(--text); background: var(--surface-alt); }
  .nav-link.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0.9rem; right: 0.9rem;
    height: 2px; background: var(--accent); border-radius: 2px 2px 0 0;
  }
  .nav-user { flex-shrink: 0; }
  .user-chip { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text-muted); }
  .user-dot { width: 7px; height: 7px; background: #3ecf8e; border-radius: 50%; flex-shrink: 0; }
  .role-badge {
    background: var(--accent); color: #fff; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.08em; padding: 0.15rem 0.4rem; border-radius: 2px; text-transform: uppercase;
  }
  .main-content { flex: 1; }
  @media (max-width: 600px) {
    .navbar { padding: 0 1rem; }
    .brand-name { display: none; }
    .user-chip { display: none; }
  }
</style>
