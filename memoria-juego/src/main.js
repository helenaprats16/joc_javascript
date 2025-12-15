import * as bootstrap from 'bootstrap';
import { router } from './router.js';
import './components/header.js';
import './components/footer.js';
import { initAuthState, isAuthenticated } from './services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.querySelector('#app');
  const headerDiv = document.querySelector('#header');
  const footerDiv = document.querySelector('#footer');

  // Inicialitzar estat d'autenticació
  initAuthState();

  // Crear i afegir Web Components
  const header = document.createElement('app-header');
  headerDiv.appendChild(header);
  
  const footer = document.createElement('app-footer');
  footerDiv.appendChild(footer);

  // Si no està autenticat, redirigir a login
  if (!isAuthenticated() && window.location.hash !== '#registre') {
    window.location.hash = '#login';
  }
  
  router(window.location.hash, appDiv);
  
  window.addEventListener('hashchange', () => {
    router(window.location.hash, appDiv);
  });
});
