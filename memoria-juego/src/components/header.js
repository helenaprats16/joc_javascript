import { authState$, logout } from '../services/authService.js';

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupAuthListener();
  }

  render() {
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg bg-body-tertiary';
    
    const container = document.createElement('div');
    container.className = 'container-fluid';
    
    const brand = document.createElement('a');
    brand.className = 'navbar-brand';
    brand.href = '#';
    brand.textContent = 'Joc Memoria';
    
    const toggler = document.createElement('button');
    toggler.className = 'navbar-toggler';
    toggler.type = 'button';
    toggler.setAttribute('data-bs-toggle', 'collapse');
    toggler.setAttribute('data-bs-target', '#navbarSupportedContent');
    toggler.innerHTML = '<span class="navbar-toggler-icon"></span>';
    
    const collapse = document.createElement('div');
    collapse.className = 'collapse navbar-collapse';
    collapse.id = 'navbarSupportedContent';
    
    this.leftMenu = document.createElement('ul');
    this.leftMenu.className = 'navbar-nav me-auto mb-2 mb-lg-0';
    
    this.rightMenu = document.createElement('ul');
    this.rightMenu.className = 'navbar-nav ms-auto';
    
    collapse.appendChild(this.leftMenu);
    collapse.appendChild(this.rightMenu);
    
    container.appendChild(brand);
    container.appendChild(toggler);
    container.appendChild(collapse);
    
    nav.appendChild(container);
    this.appendChild(nav);
  }

  setupAuthListener() {
    authState$.subscribe(state => {
      this.updateMenu(state);
    });
  }

  updateMenu(state) {
    this.leftMenu.innerHTML = '';
    this.rightMenu.innerHTML = '';
    
    // DESTRUCTURING: Extreure propietats de state
    const { isAuthenticated, user, role } = state;
    
    if (isAuthenticated) {
      this.leftMenu.innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="#content">Joc</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#scores">Puntuacions</a>
        </li>
      `;
      
      const userEmail = user?.email || 'Usuari';
      const userRole = role || 'user';
      const roleBadge = userRole === 'admin' 
        ? '<span class="badge bg-danger ms-2">ADMIN</span>' 
        : '';
      
      this.rightMenu.innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="#profile">
            <i class="bi bi-person-circle"></i> ${userEmail} ${roleBadge}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="logoutBtn">
            <i class="bi bi-box-arrow-right"></i> Tancar sessió
          </a>
        </li>
      `;
      
      const logoutBtn = this.rightMenu.querySelector('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
          window.location.hash = '#login';
        });
      }
    } else {      
      this.rightMenu.innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="#login">
            <i class="bi bi-box-arrow-in-right"></i> Login
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#registre">
            <i class="bi bi-person-plus"></i> Registre
          </a>
        </li>
      `;
    }
  }
}

customElements.define('app-header', AppHeader);

export { AppHeader };
