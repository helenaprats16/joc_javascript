// user-profile.js - Web Component per perfil d'usuari
// Permet veure i editar avatar, veure rol i estadístiques

import { authState$, getCurrentUser, getUserRole } from '../services/authService.js';
import { uploadImage } from '../services/storageService.js';
import { getUserStats } from '../services/scoresService.js';

class UserProfile extends HTMLElement {
  constructor() {
    super();
    this.subscriptions = [];
  }

  connectedCallback() {
    this.render();
    this.setupAuthListener();
  }

  disconnectedCallback() {
    // Netejar subscripcions RxJS
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  render() {
    this.innerHTML = `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h3 class="mb-0">
                  <i class="bi bi-person-circle"></i> Perfil d'Usuari
                </h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <!-- Avatar -->
                  <div class="col-md-4 text-center">
                    <div class="mb-3">
                      <img id="userAvatar" src="" alt="Avatar" class="img-fluid rounded-circle" style="width: 150px; height: 150px; object-fit: cover; border: 3px solid #007bff;">
                    </div>
                  </div>
                  
                  <!-- Informació -->
                  <div class="col-md-8">
                    <div class="mb-3">
                      <label class="text-muted">Email:</label>
                      <p class="fs-5 fw-bold" id="userEmail">-</p>
                    </div>
                    <div class="mb-3">
                      <label class="text-muted">Rol:</label>
                      <p class="fs-5">
                        <span id="userRole" class="badge bg-info">-</span>
                      </p>
                    </div>
                    <div class="mb-3">
                      <label class="text-muted">ID Usuari:</label>
                      <p class="fs-5" id="userId">-</p>
                    </div>
                  </div>
                </div>

                <!-- Botons d'acció -->
                <div class="d-flex gap-2 mt-4">
                  <a href="#scores" class="btn btn-primary">
                    <i class="bi bi-list-ul"></i> Veure Puntuacions
                  </a>
                  <a href="#content" class="btn btn-success">
                    <i class="bi bi-controller"></i> Jugar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupAuthListener() {
    // RXJS: Subscriure's a canvis d'autenticació
    const authSub = authState$.subscribe(state => {
      // DESTRUCTURING: Extreure user de state
      const { user } = state;
      if (user) {
        this.updateProfileData(user);
      }
    });
    
    this.subscriptions.push(authSub);
  }

  updateProfileData(user) {
    // DESTRUCTURING: Extreure propietats de user
    const { email, id, avatar } = user;
    const role = getUserRole();
    
    // Actualitzar DOM
    const emailEl = this.querySelector('#userEmail');
    const roleEl = this.querySelector('#userRole');
    const userIdEl = this.querySelector('#userId');
    const avatarEl = this.querySelector('#userAvatar');
    
    if (emailEl) emailEl.textContent = email;
    if (userIdEl) userIdEl.textContent = id;
    if (avatarEl) avatarEl.src = avatar || `https://www.gravatar.com/avatar/${btoa(email)}?d=identicon`;
    
    if (roleEl) {
      roleEl.textContent = role.toUpperCase();
      roleEl.className = role === 'admin' ? 'badge bg-danger' : 'badge bg-info';
    }
  }

  loadUserStats(userId) {
    try {
      // DESTRUCTURING: Obtenir estadístiques
      const { totalGames, completedGames, bestTime, averageTime } = getUserStats(userId);
      
      // Actualitzar DOM
      const totalEl = this.querySelector('#totalGames');
      const completedEl = this.querySelector('#completedGames');
      const bestEl = this.querySelector('#bestTime');
      const avgEl = this.querySelector('#avgTime');
      
      if (totalEl) totalEl.textContent = totalGames;
      if (completedEl) completedEl.textContent = completedGames;
      if (bestEl) bestEl.textContent = bestTime > 0 ? this.formatTime(bestTime) : '-';
      if (avgEl) avgEl.textContent = averageTime > 0 ? this.formatTime(averageTime) : '-';
    } catch (error) {
      console.error('Error carregant estadístiques:', error);
    }
  }

  setupEventListeners() {
    // Event listeners eliminats (avatar i edició ID)
  }
  
  saveUserId(newId) {
    try {
      const user = getCurrentUser();
      if (user) {
        user.id = newId;
        
        // Actualitzar sessió
        const session = JSON.parse(localStorage.getItem('userSession'));
        session.user.id = newId;
        localStorage.setItem('userSession', JSON.stringify(session));
        
        // Actualitzar també a devUsers
        const users = JSON.parse(localStorage.getItem('devUsers') || '{}');
        if (users[user.email]) {
          users[user.email].id = newId;
          localStorage.setItem('devUsers', JSON.stringify(users));
        }
        
        alert('ID usuario actualizado correctamente!');
      }
    } catch (error) {
      console.error('Error guardando ID:', error);
      alert('Error guardando el ID');
    }
  }

  async handleAvatarUpload(file) {
    try {
      // Validar tipus
      if (!file.type.startsWith('image/')) {
        alert('Si us plau, selecciona una imatge vàlida');
        return;
      }
      
      // Validar mida (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imatge és massa gran. Màxim 2MB');
        return;
      }
      
      // Mostrar loading
      const changeAvatarBtn = this.querySelector('#changeAvatarBtn');
      const originalText = changeAvatarBtn.innerHTML;
      changeAvatarBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Pujant...';
      changeAvatarBtn.disabled = true;
      
      // Pujar imatge (simula Storage)
      const result = await uploadImage(file, 'avatars');
      
      if (result.success) {
        // Actualitzar avatar a l'usuari
        const user = getCurrentUser();
        if (user) {
          user.avatar = result.publicUrl;
          
          // Actualitzar sessió
          const session = JSON.parse(localStorage.getItem('userSession'));
          session.user.avatar = result.publicUrl;
          localStorage.setItem('userSession', JSON.stringify(session));
          
          // Actualitzar també a devUsers
          const users = JSON.parse(localStorage.getItem('devUsers') || '{}');
          if (users[user.email]) {
            users[user.email].avatar = result.publicUrl;
            localStorage.setItem('devUsers', JSON.stringify(users));
          }
          
          // Actualitzar imatge
          const avatarEl = this.querySelector('#userAvatar');
          if (avatarEl) avatarEl.src = result.publicUrl;
          
          alert('Avatar actualitzat correctament!');
        }
      }
      
      // Restaurar botó
      changeAvatarBtn.innerHTML = originalText;
      changeAvatarBtn.disabled = false;
      
    } catch (error) {
      console.error('Error pujant avatar:', error);
      alert('Error pujant la imatge. Torna-ho a intentar.');
      
      const changeAvatarBtn = this.querySelector('#changeAvatarBtn');
      changeAvatarBtn.innerHTML = '<i class="bi bi-camera"></i> Canviar Avatar';
      changeAvatarBtn.disabled = false;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

customElements.define('user-profile', UserProfile);

export default UserProfile;
