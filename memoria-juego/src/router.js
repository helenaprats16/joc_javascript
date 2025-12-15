import './components/login-form.js';
import './components/registre-form.js';
import './components/memory-game.js';
import './components/user-profile.js';
import './components/scores-list.js';
import { isAuthenticated, isAdmin } from './services/authService.js';

export { router };

const routes = new Map([
  ['#', () => document.createElement('login-form')],
  ['#content', () => document.createElement('memory-game')],
  ['#login', () => document.createElement('login-form')],
  ['#registre', () => document.createElement('registre-form')],
  ['#profile', () => document.createElement('user-profile')],
  ['#scores', () => document.createElement('scores-list')]
]);

// Rutes protegides que requereixen autenticació
const protectedRoutes = new Set(['#content', '#profile', '#scores']);

// Rutes només per admin (sistema de permisos)
const adminRoutes = new Set([]);

function mountResult(container, result) {
  if (result instanceof HTMLElement) {
    container.innerHTML = '';
    container.appendChild(result);
  } else {
    container.innerHTML = String(result);
  }
}

function router(route, container) {
  if (!container) return;
  
  // Si la ruta està buida, establir per defecte al joc
  const currentRoute = route || '#content';
  
  // SISTEMA DE PERMISOS: Comprovar si la ruta requereix rol admin
  if (adminRoutes.has(currentRoute) && !isAdmin()) {
    // Redirigir si no és admin
    alert('No tens permisos per accedir a aquesta pàgina');
    window.location.hash = '#content';
    return;
  }
  
  // Comprovar si la ruta requereix autenticació
  if (protectedRoutes.has(currentRoute) && !isAuthenticated()) {
    // Redirigir a login si no està autenticat
    window.location.hash = '#login';
    return;
  }
  
  // Si està autenticat i intenta anar a login/registre, redirigir al joc
  if (isAuthenticated() && (currentRoute === '#login' || currentRoute === '#registre')) {
    window.location.hash = '#content';
    return;
  }
  
  const handler = routes.get(currentRoute);
  if (handler) {
    try {
      const result = handler();
      mountResult(container, result);
    } catch (error) {
      console.error('Error en router:', error);
      container.innerHTML = '<div class="alert alert-danger">Error carregant la pàgina</div>';
    }
  } else {
    container.innerHTML = '<h2>404 - Pàgina no trobada</h2>';
  }
}