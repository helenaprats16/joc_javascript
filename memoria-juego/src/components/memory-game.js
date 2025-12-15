import { 
  shuffleArray,
  createGameConfig,
  createCardEmojis,
  getInitialGameState,
  selectCard,
  resetCardSelection,
  incrementMatchedCount,
  isGameWon,
  areCardsMatching
} from '../utils/gameUtils.js';
import { createScore } from '../services/scoresService.js';

class MemoryGame extends HTMLElement {
  constructor() {
    super();
    this.gameState = getInitialGameState();
    this.config = createGameConfig();
    this.startTime = null;
    this.moves = 0;
  }

  connectedCallback() {
    this.render();
    this.setupGame();
  }

  render() {
    const emojis = createCardEmojis();
    const emojisAleatoris = shuffleArray(emojis);

    const tauler = document.createElement('div');
    tauler.classList.add('tauler', 'blocked');

    for (let i = 0; i < this.config.totalCards; i++) {
      const carta = this.crearCarta(emojisAleatoris[i]);
      tauler.appendChild(carta);
    }

    const marcador = this.crearMarcador();
    tauler.appendChild(marcador);

    const boto = this.crearBotoReiniciar();
    tauler.appendChild(boto);

    this.appendChild(tauler);
    this.tauler = tauler;
  }

  crearCarta(emoji) {
    const carta = document.createElement('div');
    carta.className = 'carta';

    const caraFront = document.createElement('div');
    caraFront.className = 'front';
    caraFront.textContent = '❓';

    const caraBack = document.createElement('div');
    caraBack.className = 'back';
    caraBack.textContent = emoji;

    carta.appendChild(caraFront);
    carta.appendChild(caraBack);

    return carta;
  }

  crearMarcador() {
    const marcador = document.createElement('div');
    marcador.textContent = 'Parelles encertades: 0';
    marcador.className = 'contador';
    this.marcador = marcador;
    return marcador;
  }

  crearBotoReiniciar() {
    const boto = document.createElement('button');
    boto.className = 'boto';
    boto.textContent = 'Reiniciar';
    boto.addEventListener('click', () => window.location.reload());
    return boto;
  }

  setupGame() {
    this.mostrarCartesInicials();
    this.afegirLogicaJoc();
  }

  mostrarCartesInicials() {
    setTimeout(() => {
      this.tauler
        .querySelectorAll('.carta')
        .forEach((carta) => carta.classList.add('girar'));
    }, this.config.showInitialTime);

    setTimeout(() => {
      this.tauler
        .querySelectorAll('.carta')
        .forEach((carta) => carta.classList.remove('girar'));
      this.tauler.classList.remove('blocked');
      // Iniciar comptador de temps
      this.startTime = Date.now();
    }, this.config.hideInitialTime);
  }

  afegirLogicaJoc() {
    const cartes = Array.from(this.tauler.querySelectorAll('.carta'));

    this.tauler.addEventListener('click', async (e) => {
      try {
        if (this.tauler.classList.contains('blocked') || this.gameState.isBlocked) return;

        const carta = e.target.closest('.carta');
        if (!carta || carta.classList.contains('girar') || carta.classList.contains('matched')) return;

        carta.classList.add('girar');
        const cartaIndex = cartes.indexOf(carta);

        if (this.gameState.card1 === null) {
          this.gameState = selectCard(this.gameState, cartaIndex);
          return;
        }

        // Incrementar comptador de moviments (cada 2 cartes = 1 moviment)
        this.moves++;

        this.gameState = selectCard(this.gameState, cartaIndex);
        const carta1 = cartes[this.gameState.card1];
        const carta2 = cartes[this.gameState.card2];
        const emoji1 = carta1.querySelector('.back').textContent;
        const emoji2 = carta2.querySelector('.back').textContent;

        if (areCardsMatching(emoji1, emoji2)) {
          carta1.classList.add('matched');
          carta2.classList.add('matched');
          this.gameState = incrementMatchedCount(this.gameState);
          this.gameState = resetCardSelection(this.gameState);
          this.marcador.textContent = `Parelles encertades: ${this.gameState.matchedCount}`;

          if (isGameWon(this.gameState.totalPairs, this.gameState.matchedCount)) {
            // Calcular temps total
            const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
            
            // CRUD CREATE: Guardar puntuació
            try {
              await createScore({
                matchedPairs: this.gameState.matchedCount,
                totalTime,
                moves: this.moves
              });
            } catch (error) {
              console.error('Error guardant puntuació:', error);
            }
            
            setTimeout(() => {
              alert(`Enhorabona, has guanyat!\\n\\nTemps: ${totalTime}s\\nMoviments: ${this.moves}`);
              window.location.hash = '#scores';
            }, this.config.victoryTime);
          }
        } else {
          setTimeout(() => {
            carta1.classList.remove('girar');
            carta2.classList.remove('girar');
            this.gameState = resetCardSelection(this.gameState);
          }, this.config.errorPairTime);
        }
      } catch (error) {
        console.error('Error en lògica del joc:', error);
        this.gameState = resetCardSelection(this.gameState);
      }
    });
  }
}

customElements.define('memory-game', MemoryGame);

export { MemoryGame };
