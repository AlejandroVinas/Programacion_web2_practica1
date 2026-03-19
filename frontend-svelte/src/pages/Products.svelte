<script>
  import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api.js';
  import { getToken, getUser } from '../stores/auth.svelte.js';
  import ProductCard from '../components/ProductCard.svelte';
  import ProductForm from '../components/ProductForm.svelte';
  import ProductDetail from '../components/ProductDetail.svelte';

  // $props: callback para mostrar toasts desde el padre (App.svelte)
  const { onToast } = $props();

  let products = $state([]);
  let loading = $state(false);
  let formLoading = $state(false);
  let showForm = $state(false);
  let editingProduct = $state(null);
  let detailProduct = $state(null);
  let showFilters = $state(false);

  // Filtros
  let search = $state('');
  let minPrice = $state('');
  let maxPrice = $state('');
  let filterActivo = $state('all'); // 'all' | 'active' | 'inactive'

  // $derived: precio máximo real del catálogo para el slider de referencia
  let maxPriceCatalog = $derived(
    products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.precio))) : 9999
  );

  // $derived: filtros combinados sin recargar el backend
  let filteredProducts = $derived.by(() => {
    let result = products;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.nombre.toLowerCase().includes(q));
    }

    if (minPrice !== '' && !isNaN(minPrice)) {
      result = result.filter(p => p.precio >= Number(minPrice));
    }

    if (maxPrice !== '' && !isNaN(maxPrice)) {
      result = result.filter(p => p.precio <= Number(maxPrice));
    }

    if (filterActivo === 'active') {
      result = result.filter(p => p.activo !== false);
    } else if (filterActivo === 'inactive') {
      result = result.filter(p => p.activo === false);
    }

    return result;
  });

  // $derived: indicador de si hay filtros activos
  let hasActiveFilters = $derived(
    search.trim() !== '' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    filterActivo !== 'all'
  );

  let isAdmin = $derived(getUser()?.role === 'admin');
  let totalCount = $derived(filteredProducts.length);

  // $effect: carga inicial de productos
  $effect(() => {
    loadProducts();
  });

  async function loadProducts() {
    loading = true;
    try {
      products = await getProducts(getToken());
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        onToast('Sesión expirada, vuelve a iniciar sesión', 'error');
      } else {
        onToast('Error al cargar productos', 'error');
      }
    } finally {
      loading = false;
    }
  }

  function clearFilters() {
    search = '';
    minPrice = '';
    maxPrice = '';
    filterActivo = 'all';
  }

  function openCreate() { editingProduct = null; showForm = true; }
  function openEdit(product) { editingProduct = product; showForm = true; }
  function closeForm() { showForm = false; editingProduct = null; }

  async function handleSave(formData, id) {
    formLoading = true;
    try {
      if (id) {
        const data = {
          nombre: formData.get('nombre'),
          precio: Number(formData.get('precio')),
          activo: formData.get('activo') === 'true'
        };
        await updateProduct(getToken(), id, data);
        onToast('Producto actualizado', 'success');
      } else {
        await createProduct(getToken(), formData);
        onToast('Producto creado', 'success');
      }
      closeForm();
      await loadProducts();
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        onToast('Sin permisos para realizar esta acción', 'error');
      } else {
        onToast(err.message || 'Error al guardar', 'error');
      }
    } finally {
      formLoading = false;
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      await deleteProduct(getToken(), id);
      onToast('Producto eliminado', 'success');
      products = products.filter(p => p._id !== id);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        onToast('Sin permisos para eliminar productos', 'error');
      } else {
        onToast(err.message || 'Error al eliminar', 'error');
      }
    }
  }
</script>

<div class="page">
  <div class="page-header">
    <div>
      <h2>Productos</h2>
      <p class="sub">
        {totalCount} producto{totalCount !== 1 ? 's' : ''}
        {#if hasActiveFilters}<span class="filter-indicator"> · filtros activos</span>{/if}
      </p>
    </div>
    <div class="header-right">
      <input
        class="search-input"
        type="text"
        placeholder="Buscar por nombre..."
        bind:value={search}
      />
      <button
        class="btn-filter"
        class:btn-filter-active={showFilters || hasActiveFilters}
        onclick={() => showFilters = !showFilters}
        title="Filtros avanzados"
      >
        ⚙ Filtros {hasActiveFilters ? '●' : ''}
      </button>
      {#if isAdmin}
        <button class="btn-new" onclick={openCreate}>+ Nuevo</button>
      {/if}
    </div>
  </div>

  <!-- Panel de filtros avanzados -->
  {#if showFilters}
    <div class="filters-panel">
      <div class="filters-row">
        <div class="filter-field">
          <label>Precio mínimo (€)</label>
          <input
            type="number" min="0" step="0.01"
            bind:value={minPrice}
            placeholder="0.00"
          />
        </div>
        <div class="filter-field">
          <label>Precio máximo (€)</label>
          <input
            type="number" min="0" step="0.01"
            bind:value={maxPrice}
            placeholder="Sin límite"
          />
        </div>
        <div class="filter-field">
          <label>Estado</label>
          <select bind:value={filterActivo}>
            <option value="all">Todos</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>
        </div>
        <div class="filter-field filter-field-btn">
          <button class="btn-clear" onclick={clearFilters} disabled={!hasActiveFilters}>
            ✕ Limpiar filtros
          </button>
        </div>
      </div>
      {#if maxPrice !== '' && minPrice !== '' && Number(maxPrice) < Number(minPrice)}
        <p class="filter-warning">⚠ El precio máximo es menor que el mínimo</p>
      {/if}
    </div>
  {/if}

  <!-- Grid de productos -->
  {#if loading}
    <div class="products-grid">
      {#each {length: 8} as _}
        <div class="skeleton"></div>
      {/each}
    </div>
  {:else if filteredProducts.length === 0}
    <div class="empty">
      {#if hasActiveFilters}
        <p>Sin resultados para los filtros aplicados</p>
        <button class="btn-clear-empty" onclick={clearFilters}>Limpiar filtros</button>
      {:else}
        <p>No hay productos aún</p>
        {#if isAdmin}
          <button class="btn-clear-empty" onclick={openCreate}>Crear primer producto</button>
        {/if}
      {/if}
    </div>
  {:else}
    <div class="products-grid">
      {#each filteredProducts as product (product._id)}
        <ProductCard
          {product}
          {isAdmin}
          onEdit={openEdit}
          onDelete={handleDelete}
          onDetail={(p) => detailProduct = p}
        />
      {/each}
    </div>
  {/if}
</div>

{#if showForm}
  <ProductForm
    product={editingProduct}
    loading={formLoading}
    onSave={handleSave}
    onCancel={closeForm}
  />
{/if}

{#if detailProduct}
  <ProductDetail product={detailProduct} onClose={() => detailProduct = null} />
{/if}

<style>
  .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }

  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
  }
  h2 {
    font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800;
    margin: 0; letter-spacing: -0.02em; color: var(--text);
  }
  .sub { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 0; }
  .filter-indicator { color: var(--accent); font-weight: 600; }

  .header-right { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
  .search-input {
    padding: 0.6rem 1rem; background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--text); outline: none; width: 210px; transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--accent); }

  .btn-filter {
    padding: 0.6rem 1rem; background: transparent; border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--text-muted); cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .btn-filter:hover { border-color: var(--accent); color: var(--text); }
  .btn-filter-active { border-color: var(--accent); color: var(--accent); }

  .btn-new {
    padding: 0.6rem 1.25rem; background: var(--accent); color: #fff; border: none;
    border-radius: 2px; font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.85rem; letter-spacing: 0.05em; cursor: pointer; white-space: nowrap;
    transition: opacity 0.15s;
  }
  .btn-new:hover { opacity: 0.85; }

  /* Panel de filtros */
  .filters-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; padding: 1.25rem; margin-bottom: 1.5rem;
  }
  .filters-row {
    display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;
  }
  .filter-field { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 130px; }
  .filter-field-btn { flex: 0; min-width: auto; justify-content: flex-end; }
  .filter-field label {
    font-size: 0.72rem; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .filter-field input, .filter-field select {
    padding: 0.6rem 0.85rem; background: var(--surface-alt); border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--text); outline: none; transition: border-color 0.15s;
  }
  .filter-field input:focus, .filter-field select:focus { border-color: var(--accent); }
  .filter-field select option { background: var(--surface); }
  .btn-clear {
    padding: 0.6rem 1rem; background: transparent; border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--text-muted); cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .btn-clear:hover:not(:disabled) { border-color: var(--danger); color: var(--danger); }
  .btn-clear:disabled { opacity: 0.4; cursor: not-allowed; }
  .filter-warning { font-size: 0.8rem; color: #e09a2b; margin-top: 0.75rem; }

  /* Grid */
  .products-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem;
  }
  .skeleton {
    height: 280px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 2px; animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .empty { text-align: center; padding: 4rem; color: var(--text-muted); }
  .empty p { margin-bottom: 1.25rem; }
  .btn-clear-empty {
    padding: 0.65rem 1.5rem; background: transparent; border: 1px solid var(--border);
    border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
    color: var(--text-muted); cursor: pointer; transition: all 0.15s;
  }
  .btn-clear-empty:hover { border-color: var(--accent); color: var(--accent); }

  @media (max-width: 600px) {
    .page { padding: 1rem; }
    .search-input { width: 150px; }
    .filters-row { flex-direction: column; }
    .filter-field { min-width: 100%; }
  }
</style>
