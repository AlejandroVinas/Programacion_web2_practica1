<script>
  // $props: recibe el producto, si es admin, y callbacks para acciones
  const { product, isAdmin, onEdit, onDelete, onDetail } = $props();

  const IMAGE_BASE = 'http://localhost:3000/uploads/';

  // $derived: el estado activo puede ser undefined en productos legacy → tratar como true
  let activo = $derived(product.activo !== false);
</script>

<div class="card" class:inactive={!activo} onclick={() => onDetail(product)}>
  <div class="card-image">
    {#if product.imagen}
      <img src="{IMAGE_BASE}{product.imagen}" alt={product.nombre} onerror={(e) => e.target.style.display='none'} />
    {:else}
      <div class="no-img"><span>sin imagen</span></div>
    {/if}

    <span class="status-badge" class:badge-active={activo} class:badge-inactive={!activo}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  </div>

  <div class="card-body">
    <h3 class="product-name">{product.nombre}</h3>
    <p class="product-price">{Number(product.precio).toFixed(2)} €</p>
  </div>

  {#if isAdmin}
    <div class="card-actions" onclick={(e) => e.stopPropagation()}>
      <button class="btn-edit" onclick={() => onEdit(product)}>Editar</button>
      <button class="btn-delete" onclick={() => onDelete(product._id)}>Eliminar</button>
    </div>
  {/if}
</div>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  .card.inactive { opacity: 0.6; }
  .card-image {
    height: 180px;
    background: var(--surface-alt);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  .card-image img { width: 100%; height: 100%; object-fit: cover; }
  .no-img {
    color: var(--text-muted);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .status-badge {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.2rem 0.55rem;
    border-radius: 2px;
    pointer-events: none;
  }
  .badge-active {
    background: rgba(62, 207, 142, 0.18);
    color: #3ecf8e;
    border: 1px solid rgba(62, 207, 142, 0.35);
  }
  .badge-inactive {
    background: rgba(192, 57, 43, 0.15);
    color: #e07060;
    border: 1px solid rgba(192, 57, 43, 0.3);
  }
  .card-body { padding: 1rem 1.2rem; flex: 1; }
  .product-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    margin: 0 0 0.4rem;
    color: var(--text);
    line-height: 1.3;
  }
  .product-price {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent);
    margin: 0;
  }
  .card-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1.2rem;
    border-top: 1px solid var(--border);
    background: var(--surface-alt);
  }
  .btn-edit, .btn-delete {
    flex: 1;
    padding: 0.4rem 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--border);
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.15s;
    letter-spacing: 0.03em;
  }
  .btn-edit { background: transparent; color: var(--text); }
  .btn-edit:hover { background: var(--border); }
  .btn-delete { background: transparent; color: var(--danger); border-color: var(--danger); }
  .btn-delete:hover { background: var(--danger); color: #fff; }
</style>
