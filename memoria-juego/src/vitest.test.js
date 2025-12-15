/**
 * @vitest-environment jsdom
 */

import { describe, test, expect, it } from 'vitest';
import { registre } from './components/registre.js';
import { 
  shuffleArray, 
  areCardsMatching, 
  countMatchedPairs, 
  isGameWon,
  createGameConfig,
  createCardEmojis,
  getInitialGameState,
  selectCard,
  resetCardSelection,
  incrementMatchedCount
} from './utils/gameUtils.js';
import { 
  isValidEmail, 
  isValidPassword, 
  doPasswordsMatch 
} from './services/validationService.js';
import { formDataToJSON } from './services/authService.js';

// Tests per a gameUtils
describe('gameUtils', () => {
  describe('shuffleArray', () => {
    it('hauria de retornar un array de la mateixa longitud', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.length).toBe(original.length);
    });

    it('no hauria de modificar l\'array original', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });

    it('hauria de contenir els mateixos elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.sort()).toEqual(original.sort());
    });
  });

  describe('areCardsMatching', () => {
    it('hauria de retornar true per emojis iguals', () => {
      expect(areCardsMatching('🍉', '🍉')).toBe(true);
    });

    it('hauria de retornar false per emojis diferents', () => {
      expect(areCardsMatching('🍉', '🥝')).toBe(false);
    });
  });

  describe('countMatchedPairs', () => {
    it('hauria de comptar correctament les parelles encertades', () => {
      const cards = [
        { isMatched: true },
        { isMatched: true },
        { isMatched: false },
        { isMatched: false }
      ];
      expect(countMatchedPairs(cards)).toBe(1);
    });

    it('hauria de retornar 0 si no hi ha parelles', () => {
      const cards = [
        { isMatched: false },
        { isMatched: false }
      ];
      expect(countMatchedPairs(cards)).toBe(0);
    });
  });

  describe('isGameWon', () => {
    it('hauria de retornar true quan totes les parelles estiguen encertades', () => {
      expect(isGameWon(10, 10)).toBe(true);
    });

    it('hauria de retornar false quan no totes les parelles estiguen encertades', () => {
      expect(isGameWon(10, 5)).toBe(false);
    });
  });

  describe('createGameConfig', () => {
    it('hauria de retornar un objecte amb la configuració correcta', () => {
      const config = createGameConfig();
      expect(config).toHaveProperty('totalCards');
      expect(config).toHaveProperty('showInitialTime');
      expect(config).toHaveProperty('hideInitialTime');
      expect(config.totalCards).toBe(20);
    });
  });

  describe('createCardEmojis', () => {
    it('hauria de retornar 20 emojis', () => {
      const emojis = createCardEmojis();
      expect(emojis.length).toBe(20);
    });

    it('cada emoji hauria d\'aparèixer exactament dues vegades', () => {
      const emojis = createCardEmojis();
      const counts = {};
      emojis.forEach(emoji => {
        counts[emoji] = (counts[emoji] || 0) + 1;
      });
      Object.values(counts).forEach(count => {
        expect(count).toBe(2);
      });
    });
  });

  describe('getInitialGameState', () => {
    it('hauria de retornar l\'estat inicial correcte', () => {
      const state = getInitialGameState();
      expect(state.card1).toBe(null);
      expect(state.card2).toBe(null);
      expect(state.isBlocked).toBe(false);
      expect(state.matchedCount).toBe(0);
      expect(state.totalPairs).toBe(10);
    });
  });

  describe('selectCard', () => {
    it('hauria de seleccionar la primera carta', () => {
      const state = getInitialGameState();
      const newState = selectCard(state, 0);
      expect(newState.card1).toBe(0);
      expect(newState.card2).toBe(null);
    });

    it('hauria de seleccionar la segona carta i bloquejar', () => {
      const state = { ...getInitialGameState(), card1: 0 };
      const newState = selectCard(state, 5);
      expect(newState.card2).toBe(5);
      expect(newState.isBlocked).toBe(true);
    });
  });

  describe('resetCardSelection', () => {
    it('hauria de resetejar la selecció de cartes', () => {
      const state = { card1: 0, card2: 5, isBlocked: true, matchedCount: 0, totalPairs: 10 };
      const newState = resetCardSelection(state);
      expect(newState.card1).toBe(null);
      expect(newState.card2).toBe(null);
      expect(newState.isBlocked).toBe(false);
    });
  });

  describe('incrementMatchedCount', () => {
    it('hauria d\'incrementar el comptador de parelles', () => {
      const state = getInitialGameState();
      const newState = incrementMatchedCount(state);
      expect(newState.matchedCount).toBe(1);
    });
  });
});

// Tests per a validationService
describe('validationService', () => {
  describe('isValidEmail', () => {
    it('hauria de validar emails correctes', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('hauria de rebutjar emails incorrectes', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('hauria de validar contrasenyes de 6 o més caràcters', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('password123')).toBe(true);
    });

    it('hauria de rebutjar contrasenyes curtes', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
    });
  });

  describe('doPasswordsMatch', () => {
    it('hauria de retornar true per contrasenyes iguals', () => {
      expect(doPasswordsMatch('password', 'password')).toBe(true);
    });

    it('hauria de retornar false per contrasenyes diferents', () => {
      expect(doPasswordsMatch('password', 'different')).toBe(false);
    });

    it('hauria de retornar false per strings buits', () => {
      expect(doPasswordsMatch('', '')).toBe(false);
    });
  });
});

// Tests per a authService
describe('authService', () => {
  describe('formDataToJSON', () => {
    it('hauria de convertir FormData a JSON', () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', '123456');
      
      const json = formDataToJSON(formData);
      expect(json.email).toBe('test@example.com');
      expect(json.password).toBe('123456');
    });

    it('hauria de retornar un objecte buit per FormData buit', () => {
      const formData = new FormData();
      const json = formDataToJSON(formData);
      expect(Object.keys(json).length).toBe(0);
    });
  });
});

// Tests per a component de registre
describe('Tests del joc de memoria', () => {
  describe('Funció de registre', () => {
    test('ha de retornar un element HTML', () => {
      expect(registre()).toBeInstanceOf(HTMLElement);
    });
  });
});

// Tests per StorageService
describe('storageService', () => {
  describe('formatBytes', () => {
    it('hauria de formatar 0 bytes', async () => {
      const { formatBytes } = await import('./services/storageService.js');
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('hauria de formatar bytes a KB', async () => {
      const { formatBytes } = await import('./services/storageService.js');
      expect(formatBytes(1024)).toBe('1 KB');
    });

    it('hauria de formatar bytes a MB', async () => {
      const { formatBytes } = await import('./services/storageService.js');
      expect(formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('getTotalStorageUsed (REDUCE)', () => {
    it('hauria de retornar 0 si no hi ha imatges', async () => {
      const { getTotalStorageUsed } = await import('./services/storageService.js');
      localStorage.removeItem('uploadedImages');
      expect(getTotalStorageUsed()).toBe(0);
    });
  });
});

// Tests per ScoresService (CRUD i REDUCE)
describe('scoresService', () => {
  describe('formatTime', () => {
    it('hauria de formatar segons a MM:SS', async () => {
      const { formatTime } = await import('./services/scoresService.js');
      expect(formatTime(65)).toBe('1:05');
    });

    it('hauria de formatar 0 segons', async () => {
      const { formatTime } = await import('./services/scoresService.js');
      expect(formatTime(0)).toBe('0:00');
    });

    it('hauria de formatar 120 segons', async () => {
      const { formatTime } = await import('./services/scoresService.js');
      expect(formatTime(120)).toBe('2:00');
    });
  });

  describe('getGlobalStats (REDUCE)', () => {
    it('hauria de retornar stats buides si no hi ha puntuacions', async () => {
      const { getGlobalStats } = await import('./services/scoresService.js');
      localStorage.removeItem('gameScores');
      const stats = getGlobalStats();
      expect(stats.totalGames).toBe(0);
      expect(stats.completedGames).toBe(0);
      expect(stats.averageTime).toBe(0);
      expect(stats.averageMoves).toBe(0);
    });
  });

  describe('getAllScores (READ)', () => {
    it('hauria de retornar array buit si no hi ha puntuacions', async () => {
      const { getAllScores } = await import('./services/scoresService.js');
      localStorage.removeItem('gameScores');
      expect(getAllScores()).toEqual([]);
    });
  });
});

// Tests per AuthService amb DESTRUCTURING
describe('authService - sistema de permisos', () => {
  describe('getUserRole', () => {
    it('hauria de retornar user per defecte', async () => {
      const { getUserRole } = await import('./services/authService.js');
      expect(getUserRole()).toBe('user');
    });
  });

  describe('isAdmin', () => {
    it('hauria de retornar false per usuaris no admin', async () => {
      const { isAdmin } = await import('./services/authService.js');
      expect(isAdmin()).toBe(false);
    });
  });

  describe('generateAvatarUrl', () => {
    it('hauria de generar URL de Gravatar', async () => {
      const { generateAvatarUrl } = await import('./services/authService.js');
      const url = generateAvatarUrl('test@example.com');
      expect(url).toContain('gravatar.com');
      expect(url).toContain('avatar');
    });
  });
});