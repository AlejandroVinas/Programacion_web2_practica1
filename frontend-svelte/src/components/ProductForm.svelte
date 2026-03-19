<script>
  // $props: producto a editar (null si es nuevo), callbacks onSave/onCancel
  const { product = null, onSave, onCancel, loading = false } = $props();

  let nombre = $state(product?.nombre ?? '');
  let precio = $state(product?.precio ?? '');
  let activo = $state(product?.activo !== false); // default true
  let imageFile = $state(null);
  let errors = $state({});

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!precio || isNaN(precio) || Number(precio) <= 0) e.precio = 'Precio debe ser mayor que 0';
    errors = e;
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('precio', precio);
    formData.append('activo', activo);
    if (imageFile) formData.append('imagen', imageFile);
    onSave(formData, product?._id);
  }

  function handleFileChange(e) {
    imageFile = e.target.files[0] || null;
  }
</script>

<div class="form-overlay" onclick={onCancel}>
  <div class="form-modal" onclick={(e) => e.stopPropagation()}>
    <div class="form-header">
      <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      <button class="close-btn" onclick={onCancel}>✕</button>
    </div>

    <div class="form-body">
      <div class="field">
        <label for="nombre">Nombre</label>
        <input id="nombre" type="text" bind:value={nombre} placeholder="Nombre del producto" class:error={errors.nombre} />
        {#if errors.nombre}<span class="err-msg">{errors.nombre}</span>{/if}
      </div>

      <div class="field">
        <label for="precio">Precio (€)</label>
        <input id="precio" type="number" step="0.01" min="0" bind:value={precio} placeholder="0.00" class:error={errors.precio} />
        {#if errors.precio}<span class="err-msg">{errors.precio}</span>{/if}
      </div>

      <div class="field field-row">
        <label class="toggle-label">
          <span>Estado</span>
          <div class="toggle-wrap">
            <input type="checkbox" id="activo" bind:checked={activo} />
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
            <span class="toggle-text">{activo ? 'Activo' : 'Inactivo'}</span>
          </div>
        </label>
      </div>

      <div class="field">
        <label for="imagen">Imagen (opcional)</label>
        <input id="imagen" type="file" accept="image/*" onchange={handleFileChange} />
      </div>
    </div>

    <div class="form-footer">
      <button class="btn-cancel" onclick={onCancel} disabled={loading}>Cancelar</button>
      <button class="btn-save" onclick={handleSubmit} disabled={loading}>
        {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
      </button>
    </div>
  </div>
</div>

<style>
  .form-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 1rem;
    backdrop-filter: blur(3px);
  }
  .form-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .form-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem; border-bottom: 1px solid var(--border);
  }
  .form-header h2 {
    font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700;
    margin: 0; letter-spacing: -0.01em;
  }
  .close-btn {
    background: none; border: none; font-size: 1rem;
    color: var(--text-muted); cursor: pointer; padding: 0.25rem;
    transition: color 0.15s;
  }
  .close-btn:hover { color: var(--text); }
  .form-body {
    padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;
  }
  .field { display: flex; flex-direction: column; gap: 0.4rem; }
  .field-row { flex-direction: row; align-items: center; }
  label {
    font-size: 0.8rem; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  input[type="text"], input[type="number"] {
    padding: 0.7rem 0.9rem;
    background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; color: var(--text); outline: none;
    transition: border-color 0.15s;
  }
  input:focus { border-color: var(--accent); }
  input.error { border-color: var(--danger); }
  input[type="file"] {
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--text-muted); padding: 0.4rem 0;
  }
  .err-msg { font-size: 0.78rem; color: var(--danger); }

  /* Toggle switch */
  .toggle-label {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; text-transform: uppercase; letter-spacing: 0.08em;
    font-size: 0.8rem; font-weight: 600; color: var(--text-muted);
    cursor: pointer;
  }
  .toggle-wrap { display: flex; align-items: center; gap: 0.6rem; }
  .toggle-wrap input[type="checkbox"] { display: none; }
  .toggle-track {
    width: 40px; height: 22px; background: var(--border);
    border-radius: 11px; position: relative; transition: background 0.2s;
    cursor: pointer; display: block;
  }
  input[type="checkbox"]:checked + .toggle-track { background: #3ecf8e; }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; background: #fff;
    border-radius: 50%; transition: transform 0.2s;
  }
  input[type="checkbox"]:checked + .toggle-track .toggle-thumb {
    transform: translateX(18px);
  }
  .toggle-text { font-size: 0.85rem; color: var(--text); font-weight: 500; min-width: 55px; }

  .form-footer {
    display: flex; gap: 0.75rem; padding: 1rem 1.5rem;
    border-top: 1px solid var(--border); justify-content: flex-end;
  }
  .btn-cancel, .btn-save {
    padding: 0.65rem 1.4rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500;
    border-radius: 2px; cursor: pointer; transition: all 0.15s;
    border: 1px solid var(--border);
  }
  .btn-cancel { background: transparent; color: var(--text); }
  .btn-cancel:hover { background: var(--surface-alt); }
  .btn-save { background: var(--accent); color: #fff; border-color: var(--accent); }
  .btn-save:hover:not(:disabled) { opacity: 0.85; }
  .btn-save:disabled, .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
