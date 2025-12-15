// Funcions pures per al joc de memòria

// Barrejar array de forma aleatòria (Pure function)
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Comprovar si dos emojis són iguals
export const areCardsMatching = (emoji1, emoji2) => {
  return emoji1 === emoji2;
};

// Comptar parelles encertades
export const countMatchedPairs = (cards) => {
  return cards.filter(card => card.isMatched).length / 2;
};

// Comprovar si el joc ha acabat
export const isGameWon = (totalPairs, matchedPairs) => {
  return matchedPairs === totalPairs;
};

// Crear configuració del joc
export const createGameConfig = () => {
  return {
    totalCards: 20,
    showInitialTime: 200,
    hideInitialTime: 5000,
    errorPairTime: 1000,
    victoryTime: 1000,
  };
};

// Crear array d'emojis duplicats
export const createCardEmojis = () => {
  return [
    '🍉', '🥝', '🍪', '🍖', '🥖',
    '🥚', '🍔', '🍕', '🫐', '🥗',
    '🍉', '🥝', '🍪', '🍖', '🥖',
    '🥚', '🍔', '🍕', '🫐', '🥗',
  ];
};

// Obtenir estat inicial del joc
export const getInitialGameState = () => {
  return {
    card1: null,
    card2: null,
    isBlocked: false,
    matchedCount: 0,
    totalPairs: 10
  };
};

// Actualitzar estat amb nova carta seleccionada
export const selectCard = (gameState, cardIndex) => {
  if (gameState.card1 === null) {
    return { ...gameState, card1: cardIndex };
  }
  return { ...gameState, card2: cardIndex, isBlocked: true };
};

// Resetear selecció de cartes
export const resetCardSelection = (gameState) => {
  return { ...gameState, card1: null, card2: null, isBlocked: false };
};

// Incrementar contador de parelles
export const incrementMatchedCount = (gameState) => {
  return { ...gameState, matchedCount: gameState.matchedCount + 1 };
};
