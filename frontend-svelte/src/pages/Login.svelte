<script>
  import { login } from '../services/api.js';
  import { setAuth } from '../stores/auth.svelte.js';

  // $props: callbacks para login exitoso y navegar a registro
  const { onLogin, onGoRegister } = $props();

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      error = 'Introduce usuario y contraseña';
      return;
    }
    error = '';
    loading = true;
    try {
      const data = await login(username, password);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setAuth(data.token, {
        username: payload.username || username,
        role: payload.role || 'user',
        id: payload.id
      });
      onLogin();
    } catch (err) {
      error = err.message || 'Credenciales incorrectas';
    } finally {
      loading = false;
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit();
  }
</script>

<div class="login-wrap">
  <div class="login-box">
    <div class="brand">
      <div class="brand-mark">PW2</div>
      <h1>Iniciar sesión</h1>
      <p>Accede para gestionar los productos</p>
    </div>

    {#if error}
      <div class="alert-error">{error}</div>
    {/if}

    <div class="fields">
      <div class="field">
        <label for="uname">Usuario</label>
        <input id="uname" type="text" bind:value={username} onkeydown={handleKey}
          placeholder="admin" autocomplete="username" />
      </div>
      <div class="field">
        <label for="pass">Contraseña</label>
        <input id="pass" type="password" bind:value={password} onkeydown={handleKey}
          placeholder="••••••••" autocomplete="current-password" />
      </div>
    </div>

    <button class="btn-login" onclick={handleSubmit} disabled={loading}>
      {loading ? 'Entrando...' : 'Entrar'}
    </button>

    <p class="register-link">
      ¿No tienes cuenta?
      <button class="link-btn" onclick={onGoRegister}>Regístrate</button>
    </p>

    <p class="hint">Usuarios de prueba: <code>admin/admin123</code> · <code>user/user123</code></p>
  </div>
</div>

<style>
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); padding: 1rem;
  }
  .login-box {
    width: 100%; max-width: 400px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 2px; padding: 2.5rem;
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
  p { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
  .alert-error {
    background: rgba(192,57,43,0.1); border: 1px solid var(--danger);
    color: var(--danger); padding: 0.7rem 1rem; border-radius: 2px;
    font-size: 0.875rem; margin-bottom: 1.25rem;
  }
  .fields { display: flex; flex-direction: column; gap: 1.1rem; margin-bottom: 1.5rem; }
  .field { display: flex; flex-direction: column; gap: 0.4rem; }
  label {
    font-size: 0.78rem; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  input {
    padding: 0.75rem 1rem; background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    color: var(--text); outline: none; transition: border-color 0.15s; width: 100%; box-sizing: border-box;
  }
  input:focus { border-color: var(--accent); }
  .btn-login {
    width: 100%; padding: 0.85rem; background: var(--accent); color: #fff; border: none;
    border-radius: 2px; font-family: 'Syne', sans-serif; font-size: 0.95rem;
    font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: opacity 0.15s;
    text-transform: uppercase;
  }
  .btn-login:hover:not(:disabled) { opacity: 0.85; }
  .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
  .register-link {
    text-align: center; font-size: 0.875rem; color: var(--text-muted); margin-top: 1.1rem;
  }
  .link-btn {
    background: none; border: none; color: var(--accent); font-size: 0.875rem;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600;
    padding: 0; text-decoration: underline; transition: opacity 0.15s;
  }
  .link-btn:hover { opacity: 0.75; }
  .hint { text-align: center; font-size: 0.78rem; color: var(--text-muted); margin-top: 0.75rem; }
  code { background: var(--surface-alt); padding: 0.1rem 0.3rem; border-radius: 2px; font-size: 0.75rem; }
</style>
