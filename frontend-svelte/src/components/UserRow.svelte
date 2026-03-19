<script>
  // $props: datos del usuario, id del admin actual, y callbacks de acción
  const { user, currentUserId, onChangeRole, onDelete } = $props();

  // $derived: no se puede eliminar ni cambiar el rol del propio admin
  let isSelf = $derived(user._id === currentUserId);
</script>

<tr class="user-row" class:self-row={isSelf}>
  <td class="td-user">
    <div class="user-info">
      <div class="avatar">{user.username[0].toUpperCase()}</div>
      <span class="username">{user.username}</span>
      {#if isSelf}<span class="self-tag">tú</span>{/if}
    </div>
  </td>

  <td class="td-role">
    <span class="role-badge role-{user.role}">
      {user.role === 'admin' ? '★ Admin' : 'Usuario'}
    </span>
  </td>

  <td class="td-actions">
    {#if !isSelf}
      <button
        class="btn-role"
        onclick={() => onChangeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
        title={user.role === 'admin' ? 'Degradar a usuario' : 'Promover a admin'}
      >
        {user.role === 'admin' ? '↓ Degradar' : '↑ Promover'}
      </button>
      <button
        class="btn-del"
        onclick={() => onDelete(user._id, user.username)}
      >
        Eliminar
      </button>
    {:else}
      <span class="no-actions">—</span>
    {/if}
  </td>
</tr>

<style>
  .user-row { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .user-row:hover { background: var(--surface-alt); }
  .self-row { background: rgba(224, 90, 43, 0.04); }
  td { padding: 0.9rem 1rem; vertical-align: middle; }
  .user-info { display: flex; align-items: center; gap: 0.75rem; }
  .avatar {
    width: 32px; height: 32px; background: var(--accent); color: #fff;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.8rem;
    flex-shrink: 0;
  }
  .username { font-weight: 500; color: var(--text); font-size: 0.9rem; }
  .self-tag {
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; background: var(--surface-alt); color: var(--text-muted);
    border: 1px solid var(--border); padding: 0.1rem 0.4rem; border-radius: 2px;
  }
  .role-badge {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 0.25rem 0.6rem; border-radius: 2px;
  }
  .role-admin { background: rgba(224,90,43,0.15); color: var(--accent); border: 1px solid rgba(224,90,43,0.3); }
  .role-user { background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); }
  .td-actions { display: flex; gap: 0.5rem; align-items: center; }
  .btn-role, .btn-del {
    padding: 0.35rem 0.8rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; border-radius: 2px; cursor: pointer;
    transition: all 0.15s; border: 1px solid var(--border); white-space: nowrap;
  }
  .btn-role { background: transparent; color: var(--text); }
  .btn-role:hover { background: var(--border); }
  .btn-del { background: transparent; color: var(--danger); border-color: var(--danger); }
  .btn-del:hover { background: var(--danger); color: #fff; }
  .no-actions { color: var(--text-muted); font-size: 0.85rem; }
</style>
