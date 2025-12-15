// scoresService.js - Servei CRUD per gestió de puntuacions
// CREATE, READ, UPDATE, DELETE de partides

import { getCurrentUser } from './authService.js';

const SCORES_KEY = 'gameScores';

// Inicialitzar storage de puntuacions
const initScores = () => {
  if (!localStorage.getItem(SCORES_KEY)) {
    localStorage.setItem(SCORES_KEY, JSON.stringify([]));
  }
};

// CREATE: Crear nova puntuació
const createScore = (scoreData) => {
  try {
    initScores();
    const scores = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
    const user = getCurrentUser();
    
    // DESTRUCTURING: Extreure dades de la partida
    const { matchedPairs, totalTime, moves } = scoreData;
    
    const newScore = {
      id: Date.now().toString(),
      userId: user?.id || 'anonymous',
      userEmail: user?.email || 'anonymous',
      matchedPairs: matchedPairs || 0,
      totalTime: totalTime || 0,
      moves: moves || 0,
      completedAt: new Date().toISOString(),
      completed: matchedPairs === 10 // Joc completat si 10 parelles
    };
    
    scores.push(newScore);
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    
    return { success: true, score: newScore };
  } catch (error) {
    console.error('Error creant puntuació:', error);
    throw error;
  }
};

// READ: Obtenir totes les puntuacions
const getAllScores = () => {
  try {
    initScores();
    return JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
  } catch (error) {
    console.error('Error obtenint puntuacions:', error);
    return [];
  }
};

// READ: Obtenir puntuació per ID
const getScoreById = (id) => {
  try {
    initScores();
    const scores = getAllScores();
    return scores.find(score => score.id === id) || null;
  } catch (error) {
    console.error('Error obtenint puntuació:', error);
    return null;
  }
};

// READ: Obtenir puntuacions de l'usuari actual
const getCurrentUserScores = () => {
  try {
    initScores();
    const user = getCurrentUser();
    if (!user) return [];
    
    const scores = getAllScores();
    // FILTER: Filtrar per usuari actual
    return scores.filter(score => score.userId === user.id);
  } catch (error) {
    console.error('Error obtenint puntuacions usuari:', error);
    return [];
  }
};

// UPDATE: Actualitzar puntuació
const updateScore = (id, updateData) => {
  try {
    initScores();
    const scores = getAllScores();
    const index = scores.findIndex(score => score.id === id);
    
    if (index === -1) {
      throw new Error('Puntuació no trobada');
    }
    
    // Actualitzar només camps permesos
    scores[index] = {
      ...scores[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    
    return { success: true, score: scores[index] };
  } catch (error) {
    console.error('Error actualitzant puntuació:', error);
    throw error;
  }
};

// DELETE: Eliminar puntuació
const deleteScore = (id) => {
  try {
    initScores();
    const scores = getAllScores();
    const filteredScores = scores.filter(score => score.id !== id);
    
    if (scores.length === filteredScores.length) {
      throw new Error('Puntuació no trobada');
    }
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(filteredScores));
    
    return { success: true, message: 'Puntuació eliminada' };
  } catch (error) {
    console.error('Error eliminant puntuació:', error);
    throw error;
  }
};

// DELETE: Eliminar totes les puntuacions d'un usuari
const deleteUserScores = (userId) => {
  try {
    initScores();
    const scores = getAllScores();
    const filteredScores = scores.filter(score => score.userId !== userId);
    
    localStorage.setItem(SCORES_KEY, JSON.stringify(filteredScores));
    
    return { success: true, message: 'Puntuacions eliminades' };
  } catch (error) {
    console.error('Error eliminant puntuacions:', error);
    throw error;
  }
};

// FUNCIONS ESTADÍSTIQUES AMB PROGRAMACIÓ FUNCIONAL

// MAP: Obtenir millors puntuacions (ordenades)
const getTopScores = (limit = 10) => {
  try {
    initScores();
    const scores = getAllScores();
    
    // Només partides completades
    const completedScores = scores.filter(score => score.completed);
    
    // Ordenar per temps (menys temps = millor)
    return completedScores
      .sort((a, b) => a.totalTime - b.totalTime)
      .slice(0, limit);
  } catch (error) {
    console.error('Error obtenint top scores:', error);
    return [];
  }
};

// REDUCE: Calcular estadístiques globals
const getGlobalStats = () => {
  try {
    initScores();
    const scores = getAllScores();
    
    if (scores.length === 0) {
      return {
        totalGames: 0,
        completedGames: 0,
        averageTime: 0,
        averageMoves: 0
      };
    }
    
    const completedScores = scores.filter(score => score.completed);
    
    // REDUCE: Sumar tots els temps
    const totalTime = completedScores.reduce((sum, score) => sum + score.totalTime, 0);
    
    // REDUCE: Sumar tots els moviments
    const totalMoves = completedScores.reduce((sum, score) => sum + score.moves, 0);
    
    return {
      totalGames: scores.length,
      completedGames: completedScores.length,
      averageTime: completedScores.length > 0 ? Math.round(totalTime / completedScores.length) : 0,
      averageMoves: completedScores.length > 0 ? Math.round(totalMoves / completedScores.length) : 0
    };
  } catch (error) {
    console.error('Error calculant estadístiques:', error);
    return {
      totalGames: 0,
      completedGames: 0,
      averageTime: 0,
      averageMoves: 0
    };
  }
};

// REDUCE: Calcular estadístiques per usuari
const getUserStats = (userId) => {
  try {
    initScores();
    const scores = getAllScores();
    const userScores = scores.filter(score => score.userId === userId);
    const completedScores = userScores.filter(score => score.completed);
    
    if (completedScores.length === 0) {
      return {
        totalGames: userScores.length,
        completedGames: 0,
        bestTime: 0,
        averageTime: 0
      };
    }
    
    // REDUCE: Trobar millor temps
    const bestTime = completedScores.reduce((min, score) => 
      score.totalTime < min ? score.totalTime : min, 
    Infinity
    );
    
    // REDUCE: Calcular mitjana de temps
    const totalTime = completedScores.reduce((sum, score) => sum + score.totalTime, 0);
    
    return {
      totalGames: userScores.length,
      completedGames: completedScores.length,
      bestTime: bestTime === Infinity ? 0 : bestTime,
      averageTime: Math.round(totalTime / completedScores.length)
    };
  } catch (error) {
    console.error('Error calculant estadístiques usuari:', error);
    return {
      totalGames: 0,
      completedGames: 0,
      bestTime: 0,
      averageTime: 0
    };
  }
};

// Formatar temps en segons a MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export {
  createScore,
  getAllScores,
  getScoreById,
  getCurrentUserScores,
  updateScore,
  deleteScore,
  deleteUserScores,
  getTopScores,
  getGlobalStats,
  getUserStats,
  formatTime
};
