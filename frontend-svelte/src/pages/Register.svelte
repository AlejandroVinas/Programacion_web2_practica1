<script>
  import { register, login } from '../services/api.js';
  import { setAuth } from '../stores/auth.svelte.js';

  // $props: callbacks para navegar al login o tras registro exitoso
  const { onGoLogin, onRegistered } = $props();

  let username = $state('');
  let password = $state('');
  let password2 = $state('');
  let error = $state('');
  let success = $state('');
  let loading = $state(false);

  // $derived: el botón solo se activa si todos los campos tienen contenido
  let canSubmit = $derived(
    username.trim().length >= 3 &&
    password.length >= 4 &&
    password === password2
  );

  // $derived: mensaje de error de confirmación de contraseña en tiempo real
  let passwordMismatch = $derived(
    password2.length > 0 && password !== password2
  );

  async function handleSubmit() {
    if (!canSubmit) return;
    error = '';
    success = '';
    loading = true;
    try {
      await register(username.trim(), password);
      success = '¡Cuenta creada! Entrando automáticamente...';
      const data = await login(username.trim(), password);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setAuth(data.token, { username: payload.username || username.trim(), role: payload.role || 'user', id: payload.id });
      onRegistered();
    } catch (err) {
      error = err.message || 'Error al registrarse';
    } finally {
      loading = false;
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && canSubmit) handleSubmit();
  }
</script>

<div class="register-wrap">
  <div class="register-box">
    <div class="brand">
      <div class="brand-mark">PW2</div>
      <h1>Crear cuenta</h1>
      <p>Las cuentas nuevas tienen rol <strong>usuario</strong>.<br/>Solo un admin puede promover a admin.</p>
    </div>

    {#if error}
      <div class="alert alert-error">{error}</div>
    {/if}
    {#if success}
      <div class="alert alert-success">{success}</div>
    {/if}

    <div class="fields">
      <div class="field">
        <label for="uname">Usuario <span class="hint-inline">(mín. 3 caracteres)</span></label>
        <input
          id="uname"
          type="text"
          bind:value={username}
          onkeydown={handleKey}
          placeholder="nuevo_usuario"
          autocomplete="username"
        />
      </div>

      <div class="field">
        <label for="pass">Contraseña <span class="hint-inline">(mín. 4 caracteres)</span></label>
        <input
          id="pass"
          type="password"
          bind:value={password}
          onkeydown={handleKey}
          placeholder="••••••••"
          autocomplete="new-password"
        />
      </div>

      <div class="field">
        <label for="pass2">Confirmar contraseña</label>
        <input
          id="pass2"
          type="password"
          bind:value={password2}
          onkeydown={handleKey}
          placeholder="••••••••"
          class:input-error={passwordMismatch}
          autocomplete="new-password"
        />
        {#if passwordMismatch}
          <span class="field-error">Las contraseñas no coinciden</span>
        {/if}
      </div>
    </div>

    <div class="role-info">
      <span class="role-badge">👤 Usuario</span>
      <span>Se registrará como usuario estándar</span>
    </div>

    <button class="btn-register" onclick={handleSubmit} disabled={!canSubmit || loading}>
      {loading ? 'Registrando...' : 'Crear cuenta'}
    </button>

    <p class="back-link">
      ¿Ya tienes cuenta?
      <button class="link-btn" onclick={onGoLogin}>Inicia sesión</button>
    </p>
  </div>
</div>

<style>
  .register-wrap {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg); padding: 1rem;
  }
  .register-box {
    width: 100%; max-width: 420px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; padding: 2.5rem;
    box-shadow: 0 2px 40px rgba(0,0,0,0.08);
  }
  .brand { text-align: center; margin-bottom: 2rem; }
  .brand-mark {
    display: inline-block; background: var(--accent); color: #fff;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem;
    letter-spacing: 0.15em; padding: 0.35rem 0.8rem; margin-bottom: 1rem;
  }
  h1 {
    font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800;
    margin: 0 0 0.4rem; letter-spacing: -0.02em; color: var(--text);
  }
  p { color: var(--text-muted); font-size: 0.85rem; margin: 0; line-height: 1.5; }
  strong { color: var(--text); }
  .alert {
    padding: 0.7rem 1rem; border-radius: 2px; font-size: 0.875rem; margin-bottom: 1.25rem;
    border: 1px solid;
  }
  .alert-error { background: rgba(192,57,43,0.1); border-color: var(--danger); color: var(--danger); }
  .alert-success { background: rgba(62,207,142,0.1); border-color: #3ecf8e; color: #3ecf8e; }
  .fields { display: flex; flex-direction: column; gap: 1.1rem; margin-bottom: 1.25rem; }
  .field { display: flex; flex-direction: column; gap: 0.4rem; }
  label {
    font-size: 0.78rem; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .hint-inline { font-size: 0.7rem; text-transform: none; letter-spacing: 0; color: var(--text-muted); opacity: 0.7; }
  input {
    padding: 0.75rem 1rem; background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    color: var(--text); outline: none; transition: border-color 0.15s; width: 100%; box-sizing: border-box;
  }
  input:focus { border-color: var(--accent); }
  input.input-error { border-color: var(--danger); }
  .field-error { font-size: 0.78rem; color: var(--danger); }
  .role-info {
    display: flex; align-items: center; gap: 0.75rem;
    background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 2px; padding: 0.7rem 1rem; margin-bottom: 1.25rem;
    font-size: 0.85rem; color: var(--text-muted);
  }
  .role-badge {
    background: var(--surface); border: 1px solid var(--border);
    padding: 0.2rem 0.6rem; border-radius: 2px; font-size: 0.75rem;
    font-weight: 600; white-space: nowrap;
  }
  .btn-register {
    width: 100%; padding: 0.85rem; background: var(--accent); color: #fff;
    border: none; border-radius: 2px; font-family: 'Syne', sans-serif;
    font-size: 0.95rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer;
    transition: opacity 0.15s; text-transform: uppercase;
  }
  .btn-register:hover:not(:disabled) { opacity: 0.85; }
  .btn-register:disabled { opacity: 0.4; cursor: not-allowed; }
  .back-link {
    text-align: center; font-size: 0.85rem; color: var(--text-muted); margin-top: 1.2rem;
  }
  .link-btn {
    background: none; border: none; color: var(--accent); font-size: 0.85rem;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600;
    padding: 0; text-decoration: underline; transition: opacity 0.15s;
  }
  .link-btn:hover { opacity: 0.75; }
</style>
