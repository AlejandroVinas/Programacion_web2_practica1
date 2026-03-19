// stores/auth.svelte.js
// Estado global de autenticación con $state de Svelte 5
// Persistencia en localStorage: se restaura al recargar la página

const STORAGE_KEY = 'pw2_auth';

// Intenta restaurar sesión guardada al arrancar la app
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    return JSON.parse(raw);
  } catch {
    return { token: null, user: null };
  }
}

const saved = loadFromStorage();

// $state inicializado desde localStorage si existe
let token = $state(saved.token);
let user = $state(saved.user);

function persist() {
  try {
    if (token && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage puede no estar disponible en algunos contextos
  }
}

export function getToken() {
  return token;
}

export function getUser() {
  return user;
}

export function setAuth(newToken, newUser) {
  token = newToken;
  user = newUser;
  persist();
}

export function clearAuth() {
  token = null;
  user = null;
  persist(); // limpia el localStorage
}

export function isAuthenticated() {
  return token !== null;
}
