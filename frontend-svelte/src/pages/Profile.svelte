<script>
  import { getUser } from '../stores/auth.svelte.js';
  const { onLogout } = $props();
  let user = $derived(getUser());
</script>

<div class="page">
  <div class="profile-card">
    <div class="avatar">
      {user?.username?.[0]?.toUpperCase() ?? '?'}
    </div>

    <h2>{user?.username}</h2>

    <div class="badge badge-{user?.role}">
      {user?.role === 'admin' ? '★ Admin' : 'Usuario'}
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Nombre de usuario</span>
        <span class="info-value">{user?.username}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Rol</span>
        <span class="info-value">{user?.role}</span>
      </div>
      {#if user?.role === 'admin'}
        <div class="info-item info-full">
          <span class="info-label">Permisos</span>
          <span class="info-value">Crear, editar y eliminar productos</span>
        </div>
      {:else}
        <div class="info-item info-full">
          <span class="info-label">Permisos</span>
          <span class="info-value">Ver y consultar productos</span>
        </div>
      {/if}
    </div>

    <button class="btn-logout" onclick={onLogout}>Cerrar sesión</button>
  </div>
</div>

<style>
  .page {
    padding: 2rem;
    max-width: 480px;
    margin: 0 auto;
  }
  .profile-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 2.5rem;
    text-align: center;
  }
  .avatar {
    width: 72px;
    height: 72px;
    background: var(--accent);
    color: #fff;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 0.75rem;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border-radius: 2px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }
  .badge-admin { background: var(--accent); color: #fff; }
  .badge-user { background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    text-align: left;
    margin-bottom: 2rem;
  }
  .info-full { grid-column: 1 / -1; }
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    background: var(--surface-alt);
    padding: 0.8rem 1rem;
    border-radius: 2px;
  }
  .info-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 600;
  }
  .info-value {
    font-size: 0.9rem;
    color: var(--text);
    font-weight: 500;
  }
  .btn-logout {
    width: 100%;
    padding: 0.8rem;
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
  }
  .btn-logout:hover {
    background: var(--danger);
    color: #fff;
  }
</style>
