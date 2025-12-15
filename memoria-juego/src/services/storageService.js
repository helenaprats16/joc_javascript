// storageService.js - Servei per gestió d'imatges (simulació de Supabase Storage)
// Usa Gravatar com a simulació d'Storage d'imatges

import { getCurrentUser } from './authService.js';

const STORAGE_KEY = 'uploadedImages';

// Simular Storage amb localStorage per imatges pujades
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
};

// DESTRUCTURING: Funció per pujar imatge (simular)
const uploadImage = async (file, folder = 'avatars') => {
  try {
    initStorage();
    
    // Simular pujada: crear URL temporal amb FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageData = e.target.result;
        const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const user = getCurrentUser();
        
        // DESTRUCTURING: Extreure propietats del fitxer
        const { name, size, type } = file;
        
        const imageId = `${folder}/${Date.now()}-${name}`;
        
        images[imageId] = {
          id: imageId,
          name,
          size,
          type,
          data: imageData,
          folder,
          uploadedBy: user?.email || 'anonymous',
          uploadedAt: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
        
        resolve({
          success: true,
          url: imageData, // URL de la imatge en base64
          path: imageId,
          publicUrl: imageData
        });
      };
      
      reader.onerror = () => {
        reject(new Error('Error llegint el fitxer'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error pujant imatge:', error);
    throw error;
  }
};

// Obtenir imatge per path
const getImage = (path) => {
  try {
    initStorage();
    const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return images[path] || null;
  } catch (error) {
    console.error('Error obtenint imatge:', error);
    return null;
  }
};

// Llistar imatges per carpeta (FILTER - programació funcional)
const listImages = (folder = null) => {
  try {
    initStorage();
    const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const imageArray = Object.values(images);
    
    // FILTER: Filtrar per carpeta si s'especifica
    if (folder) {
      return imageArray.filter(img => img.folder === folder);
    }
    
    return imageArray;
  } catch (error) {
    console.error('Error llistant imatges:', error);
    return [];
  }
};

// Eliminar imatge
const deleteImage = (path) => {
  try {
    initStorage();
    const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    
    if (images[path]) {
      delete images[path];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      return { success: true, message: 'Imatge eliminada' };
    }
    
    throw new Error('Imatge no trobada');
  } catch (error) {
    console.error('Error eliminant imatge:', error);
    throw error;
  }
};

// REDUCE: Calcular espai total usat (programació funcional)
const getTotalStorageUsed = () => {
  try {
    initStorage();
    const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const imageArray = Object.values(images);
    
    // REDUCE: Sumar mida de totes les imatges
    return imageArray.reduce((total, img) => total + (img.size || 0), 0);
  } catch (error) {
    console.error('Error calculant storage:', error);
    return 0;
  }
};

// Formatar bytes a MB/KB
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export {
  uploadImage,
  getImage,
  listImages,
  deleteImage,
  getTotalStorageUsed,
  formatBytes
};
