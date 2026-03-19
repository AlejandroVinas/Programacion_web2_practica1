<script>
  const { message, type = 'info', onClose } = $props();
</script>

<div class="toast toast-{type}">
  <span>{message}</span>
  <button onclick={onClose}>✕</button>
</div>

<style>
  .toast {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1.2rem;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 200;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: slideIn 0.2s ease;
    max-width: 340px;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .toast-success { background: #1a7a4a; color: #fff; }
  .toast-error { background: #c0392b; color: #fff; }
  .toast-info { background: var(--accent); color: #fff; }
  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 0.85rem;
    opacity: 0.8;
    padding: 0;
    line-height: 1;
    transition: opacity 0.15s;
  }
  button:hover { opacity: 1; }
</style>
