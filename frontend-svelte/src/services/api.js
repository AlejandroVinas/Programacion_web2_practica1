// services/api.js
const BASE_URL = 'http://localhost:3000/api';

export async function apiRequest(endpoint, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw { status: res.status, message: err.error || err.message || 'Error en la petición' };
  }

  return res.json();
}

// Auth
export async function login(username, password) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// Productos
export async function getProducts(token, name = '') {
  const query = name ? `?name=${encodeURIComponent(name)}` : '';
  return apiRequest(`/productos${query}`, {}, token);
}

export async function createProduct(token, formData) {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, message: err.error || 'Error al crear producto' };
  }
  return res.json();
}

export async function updateProduct(token, id, data) {
  return apiRequest(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}

export async function deleteProduct(token, id) {
  return apiRequest(`/productos/${id}`, { method: 'DELETE' }, token);
}

// Auth - Register
export async function register(username, password) {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// Usuarios (solo admin)
export async function getUsers(token) {
  return apiRequest('/users', {}, token);
}

export async function createUser(token, data) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}

export async function updateUser(token, id, data) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}

export async function deleteUser(token, id) {
  return apiRequest(`/users/${id}`, { method: 'DELETE' }, token);
}
