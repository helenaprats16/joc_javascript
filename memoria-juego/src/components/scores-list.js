// scores-list.js - Web Component CRUD per llista de puntuacions
// Permet veure, ordenar i eliminar puntuacions (admin pot eliminar totes)

import { authState$, isAdmin } from '../services/authService.js';
import { 
  getAllScores, 
  getCurrentUserScores, 
  deleteScore, 
  getTopScores,
  getGlobalStats,
  formatTime 
} from '../services/scoresService.js';

class ScoresList extends HTMLElement {
  constructor() {
    super();
    this.subscriptions = [];
  }

  connectedCallback() {
    this.render();
    this.setupAuthListener();
    this.loadAllScores();
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  render() {
    const isAdminUser = isAdmin();
    
    this.innerHTML = `
      <div class="container mt-5">
        <div class="row">
          <!-- Taula de Totes les Puntuacions -->
          <div class="col-12 mb-4">
            <div class="card shadow">
              <div class="card-header bg-success text-white">
                <h4 class="mb-0">
                  <i class="bi bi-list-ul"></i> Totes les Puntuacions
                </h4>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover table-sm">
                    <thead class="table-light">
                      <tr>
                        <th>#</th>
                        <th>Usuari</th>
                        <th>Parelles</th>
                        <th>Data</th>
                        <th>Estat</th>
                        ${isAdminUser ? '<th>Eliminar</th>' : ''}
                      </tr>
                    </thead>
                    <tbody id="allScoresTableBody">
                      <tr>
                        <td colspan="6" class="text-center py-3">
                          <div class="spinner-border spinner-border-sm text-primary" role="status">
                            <span class="visually-hidden">Carregant...</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botons d'acció -->
        <div class="row">
          <div class="col-12">
            <div class="d-flex gap-2 mt-4">
              <a href="#profile" class="btn btn-outline-primary">
                <i class="bi bi-person"></i> Perfil
              </a>
              <a href="#content" class="btn btn-success">
                <i class="bi bi-controller"></i> Nova Partida
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    this.loadAllScores();
  }

  setupAuthListener() {
    const authSub = authState$.subscribe(() => {
      this.loadAllScores();
    });
    
    this.subscriptions.push(authSub);
  }

  loadAllScores() {
    try {
      const allScores = getAllScores();
      allScores.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      this.renderAllScores(allScores);
    } catch (error) {
      console.error('Error carregant puntuacions:', error);
    }
  }

  renderAllScores(scores) {
    const tbody = this.querySelector('#allScoresTableBody');
    if (!tbody) return;
    
    if (scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3 text-muted">No hi ha puntuacions</td></tr>';
      return;
    }
    
    const isAdminUser = isAdmin();
    
    tbody.innerHTML = scores.map((score, index) => {
      const { id, userEmail, matchedPairs, completedAt, completed } = score;
      const date = new Date(completedAt);
      const formattedDate = date.toLocaleDateString('ca-ES');
      const statusBadge = completed ? '<span class="badge bg-success">Completat</span>' : '<span class="badge bg-warning">Incomplet</span>';
      const deleteBtn = isAdminUser ? `<td><button class="btn btn-sm btn-outline-danger" data-delete="${id}"><i class="bi bi-trash"></i></button></td>` : '';
      
      return `<tr>
        <td>${index + 1}</td>
        <td><i class="bi bi-person-circle"></i> ${userEmail}</td>
        <td><span class="badge bg-primary">${matchedPairs}/10</span></td>
        <td><small>${formattedDate}</small></td>
        <td>${statusBadge}</td>
        ${deleteBtn}
      </tr>`;
    }).join('');
    
    const deleteButtons = tbody.querySelectorAll('[data-delete]');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scoreId = e.target.closest('button').dataset.delete;
        this.handleDelete(scoreId);
      });
    });
  }

  async handleDelete(scoreId) {
    if (!confirm('Segur que vols eliminar aquesta puntuació?')) {
      return;
    }
    
    try {
      await deleteScore(scoreId);
      this.loadAllScores();
      alert('Puntuació eliminada correctament');
    } catch (error) {
      console.error('Error eliminant puntuació:', error);
      alert('Error eliminant la puntuació');
    }
  }
}

customElements.define('scores-list', ScoresList);

export default ScoresList;
