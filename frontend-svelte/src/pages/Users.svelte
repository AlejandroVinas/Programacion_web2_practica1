<script>
  import { getUsers, createUser, updateUser, deleteUser } from '../services/api.js';
  import { getToken, getUser } from '../stores/auth.svelte.js';
  import UserRow from '../components/UserRow.svelte';

  // $props: callback para toasts globales
  const { onToast } = $props();

  let users = $state([]);
  let loading = $state(false);
  let showCreateForm = $state(false);

  // Formulario nuevo usuario (admin puede asignar cualquier rol)
  let newUsername = $state('');
  let newPassword = $state('');
  let newRole = $state('user');
  let formLoading = $state(false);

  // $derived: filtro de búsqueda de usuarios
  let search = $state('');
  let filteredUsers = $derived(
    search.trim()
      ? users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
      : users
  );

  // $derived: contadores por rol
  let adminCount = $derived(users.filter(u => u.role === 'admin').length);
  let userCount = $derived(users.filter(u => u.role === 'user').length);

  let currentUser = $derived(getUser());

  // $effect: carga usuarios al montar la página
  $effect(() => {
    loadUsers();
  });

  async function loadUsers() {
    loading = true;
    try {
      users = await getUsers(getToken());
    } catch (err) {
      onToast('Error al cargar usuarios', 'error');
    } finally {
      loading = false;
    }
  }

  async function handleChangeRole(id, newRoleValue) {
    const target = users.find(u => u._id === id);
    const action = newRoleValue === 'admin' ? 'promover a admin' : 'degradar a usuario';
    if (!confirm(`¿Seguro que quieres ${action} a "${target?.username}"?`)) return;
    try {
      await updateUser(getToken(), id, { role: newRoleValue });
      onToast(`Rol actualizado correctamente`, 'success');
      // Actualizar localmente sin recargar
      users = users.map(u => u._id === id ? { ...u, role: newRoleValue } : u);
    } catch (err) {
      onToast(err.message || 'Error al cambiar rol', 'error');
    }
  }

  async function handleDelete(id, username) {
    if (!confirm(`¿Eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUser(getToken(), id);
      onToast(`Usuario eliminado`, 'success');
      users = users.filter(u => u._id !== id);
    } catch (err) {
      onToast(err.message || 'Error al eliminar', 'error');
    }
  }

  async function handleCreate() {
    if (!newUsername.trim() || !newPassword.trim()) {
      onToast('Rellena usuario y contraseña', 'error');
      return;
    }
    formLoading = true;
    try {
      await createUser(getToken(), {
        username: newUsername.trim(),
        password: newPassword,
        role: newRole
      });
      onToast(`Usuario "${newUsername}" creado como ${newRole}`, 'success');
      newUsername = '';
      newPassword = '';
      newRole = 'user';
      showCreateForm = false;
      await loadUsers();
    } catch (err) {
      onToast(err.message || 'Error al crear usuario', 'error');
    } finally {
      formLoading = false;
    }
  }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h2>Gestión de usuarios</h2>
      <p class="sub">
        {adminCount} admin{adminCount !== 1 ? 's' : ''} ·
        {userCount} usuario{userCount !== 1 ? 's' : ''}
      </p>
    </div>
    <div class="header-right">
      <input
        class="search-input"
        type="text"
        placeholder="Buscar usuario..."
        bind:value={search}
      />
      <button class="btn-new" onclick={() => showCreateForm = !showCreateForm}>
        {showCreateForm ? '✕ Cancelar' : '+ Nuevo usuario'}
      </button>
    </div>
  </div>

  <!-- Formulario crear usuario (solo admin) -->
  {#if showCreateForm}
    <div class="create-form">
      <h3>Nuevo usuario</h3>
      <div class="form-row">
        <div class="field">
          <label>Usuario</label>
          <input type="text" bind:value={newUsername} placeholder="nombre_usuario" />
        </div>
        <div class="field">
          <label>Contraseña</label>
          <input type="password" bind:value={newPassword} placeholder="••••••••" />
        </div>
        <div class="field">
          <label>Rol</label>
          <select bind:value={newRole}>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="field field-btn">
          <button class="btn-create" onclick={handleCreate} disabled={formLoading}>
            {formLoading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
      <p class="form-note">
        ℹ️ Solo los admins pueden crear usuarios con rol admin directamente desde aquí.
        El registro público siempre crea usuarios con rol <strong>usuario</strong>.
      </p>
    </div>
  {/if}

  <!-- Tabla de usuarios -->
  {#if loading}
    <div class="loading-rows">
      {#each {length: 4} as _}
        <div class="skeleton-row"></div>
      {/each}
    </div>
  {:else if filteredUsers.length === 0}
    <div class="empty">
      <p>{search ? 'Sin resultados' : 'No hay usuarios'}</p>
    </div>
  {:else}
    <div class="table-wrap">
      <table class="users-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredUsers as user (user._id)}
            <UserRow
              {user}
              currentUserId={currentUser?.id}
              onChangeRole={handleChangeRole}
              onDelete={handleDelete}
            />
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .page { padding: 2rem; max-width: 900px; margin: 0 auto; }
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
  }
  h2 {
    font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800;
    margin: 0; letter-spacing: -0.02em; color: var(--text);
  }
  .sub { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 0; }
  .header-right { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
  .search-input {
    padding: 0.6rem 1rem; background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--text); outline: none; width: 200px; transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--accent); }
  .btn-new {
    padding: 0.6rem 1.25rem; background: var(--accent); color: #fff; border: none;
    border-radius: 2px; font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.85rem; letter-spacing: 0.05em; cursor: pointer; white-space: nowrap;
    transition: opacity 0.15s;
  }
  .btn-new:hover { opacity: 0.85; }

  /* Formulario crear */
  .create-form {
    background: var(--surface); border: 1px solid var(--accent);
    border-radius: 2px; padding: 1.5rem; margin-bottom: 1.5rem;
  }
  h3 {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem;
    margin: 0 0 1rem; color: var(--text);
  }
  .form-row {
    display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;
    margin-bottom: 0.75rem;
  }
  .field { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 130px; }
  .field-btn { flex: 0; min-width: auto; justify-content: flex-end; }
  label {
    font-size: 0.72rem; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  input[type="text"], input[type="password"], select {
    padding: 0.65rem 0.9rem; background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--text); outline: none; transition: border-color 0.15s;
  }
  input:focus, select:focus { border-color: var(--accent); }
  select option { background: var(--surface); }
  .btn-create {
    padding: 0.65rem 1.4rem; background: var(--accent); color: #fff; border: none;
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    font-weight: 600; cursor: pointer; transition: opacity 0.15s; white-space: nowrap;
  }
  .btn-create:hover:not(:disabled) { opacity: 0.85; }
  .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
  .form-note { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
  .form-note strong { color: var(--text); }

  /* Tabla */
  .table-wrap {
    background: var(--surface); border: 1px solid var(--border); border-radius: 2px;
    overflow: hidden;
  }
  .users-table { width: 100%; border-collapse: collapse; }
  thead tr { background: var(--surface-alt); border-bottom: 1px solid var(--border); }
  th {
    padding: 0.75rem 1rem; text-align: left; font-size: 0.72rem; font-weight: 700;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;
  }
  .loading-rows { display: flex; flex-direction: column; gap: 0.5rem; }
  .skeleton-row {
    height: 52px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .empty { text-align: center; padding: 3rem; color: var(--text-muted); }

  @media (max-width: 600px) {
    .form-row { flex-direction: column; }
    .field { min-width: 100%; }
  }
</style>
