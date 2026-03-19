<script>
  // $props: producto a mostrar y callback para cerrar
  const { product, onClose } = $props();
  const IMAGE_BASE = 'http://localhost:3000/uploads/';
  let activo = $derived(product.activo !== false);
</script>

<div class="overlay" onclick={onClose}>
  <div class="detail-modal" onclick={(e) => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>✕</button>

    <div class="detail-image" class:no-img={!product.imagen}>
      {#if product.imagen}
        <img src="{IMAGE_BASE}{product.imagen}" alt={product.nombre} />
      {:else}
        <span>Sin imagen</span>
      {/if}
    </div>

    <div class="detail-body">
      <div class="detail-top">
        <h2 class="detail-name">{product.nombre}</h2>
        <span class="status-badge" class:active={activo} class:inactive={!activo}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <div class="detail-price">{Number(product.precio).toFixed(2)} €</div>
      <div class="detail-id">
        <span class="label">ID</span>
        <code>{product._id}</code>
      </div>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.65);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 1rem; backdrop-filter: blur(4px);
  }
  .detail-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; width: 100%; max-width: 420px;
    overflow: hidden; position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  }
  .close-btn {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(0,0,0,0.4); border: none; color: #fff;
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    font-size: 0.8rem; display: flex; align-items: center; justify-content: center;
    z-index: 2; transition: background 0.15s;
  }
  .close-btn:hover { background: rgba(0,0,0,0.7); }
  .detail-image {
    height: 240px; background: var(--surface-alt); overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .detail-image img { width: 100%; height: 100%; object-fit: cover; }
  .detail-image.no-img { color: var(--text-muted); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
  .detail-body { padding: 1.5rem; }
  .detail-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem; margin-bottom: 0.5rem;
  }
  .detail-name {
    font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800;
    margin: 0; color: var(--text); letter-spacing: -0.02em; line-height: 1.2;
  }
  .status-badge {
    flex-shrink: 0; font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.25rem 0.6rem; border-radius: 2px; margin-top: 0.2rem;
  }
  .status-badge.active { background: rgba(62,207,142,0.15); color: #3ecf8e; border: 1px solid rgba(62,207,142,0.3); }
  .status-badge.inactive { background: rgba(192,57,43,0.15); color: #e07060; border: 1px solid rgba(192,57,43,0.3); }
  .detail-price { font-size: 1.5rem; font-weight: 700; color: var(--accent); margin-bottom: 1.25rem; }
  .detail-id {
    display: flex; align-items: center; gap: 0.75rem;
    padding-top: 1rem; border-top: 1px solid var(--border);
  }
  .label {
    font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--text-muted); font-weight: 600;
  }
  code {
    font-size: 0.75rem; color: var(--text-muted); background: var(--surface-alt);
    padding: 0.2rem 0.5rem; border-radius: 2px; word-break: break-all;
  }
</style>
