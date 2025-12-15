import { BehaviorSubject } from 'rxjs';

const API_URL = 'https://myxgvoawkaigibajyllt.supabase.co/auth/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15eGd2b2F3a2FpZ2liYWp5bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzk0NzMsImV4cCI6MjA3NjYxNTQ3M30.0tTkn-fo0KhrCD3gAxJMjaXGUcElVjy4l60c_0s2U1c';

// MODE DE DESENVOLUPAMENT: true = usa localStorage, false = usa API real
const DEV_MODE = true;

// Observable per a l'estat d'autenticació
const authState$ = new BehaviorSubject({
  isAuthenticated: false,
  user: null,
  token: null,
  role: null // 'admin' o 'user'
});

// Inicialitzar estat des de localStorage
// DESTRUCTURING: Extreure propietats de session
const initAuthState = () => {
  try {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      // DESTRUCTURING: Desestructuració d'objecte session
      const { token, user, role } = session;
      if (token && user) {
        authState$.next({
          isAuthenticated: true,
          user,
          token,
          role: role || 'user' // Per defecte 'user'
        });
      }
    }
  } catch (error) {
    console.error('Error inicialitzant sessió:', error);
    localStorage.removeItem('userSession');
  }
};

// Generar avatar amb Gravatar (simulació d'ús de Storage)
const generateAvatarUrl = (email) => {
  // Usar Gravatar per simular Storage d'imatges
  const hash = btoa(email.toLowerCase().trim()).substring(0, 32);
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

// Registre d'usuari
const registre = async (formData) => {
  try {
    const userData = formDataToJSON(formData);
    // DESTRUCTURING: Extreure email i password
    const { email, password } = userData;
    
    if (!email || !password) {
      throw new Error('Email i contrasenya són obligatoris');
    }

    // MODE DESENVOLUPAMENT: guardar localment
    if (DEV_MODE) {
      const users = JSON.parse(localStorage.getItem('devUsers') || '{}');
      
      if (users[email]) {
        throw new Error('Aquest email ja està registrat');
      }
      
      // Primer usuari és admin, resta són users
      const isFirstUser = Object.keys(users).length === 0;
      const role = isFirstUser ? 'admin' : 'user';
      
      users[email] = {
        email,
        password,
        id: Date.now().toString(),
        role,
        avatar: generateAvatarUrl(email),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('devUsers', JSON.stringify(users));
      return { success: true, message: 'Registre correcte' };
    }

    // MODE PRODUCCIÓ: usar API
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.code === 422) {
      throw new Error(data.message || 'Error en el registre');
    }

    return { success: true, message: 'Registre correcte' };
  } catch (error) {
    console.error('Error en registre:', error);
    throw error;
  }
};

// Login d'usuari
const login = async (formData) => {
  try {
    const userData = formDataToJSON(formData);
    // DESTRUCTURING: Extreure email i password
    const { email, password } = userData;
    
    if (!email || !password) {
      throw new Error('Email i contrasenya són obligatoris');
    }

    // MODE DESENVOLUPAMENT: verificar localment
    if (DEV_MODE) {
      const users = JSON.parse(localStorage.getItem('devUsers') || '{}');
      const user = users[email];
      
      if (!user || user.password !== password) {
        throw new Error('Email o contrasenya incorrectes');
      }
      
      // DESTRUCTURING: Crear sessió amb dades d'usuari
      const { id, role, avatar } = user;
      const session = {
        user: { email, id, role, avatar },
        token: 'dev-token-' + Date.now(),
        role
      };
      
      localStorage.setItem('userSession', JSON.stringify(session));
      
      authState$.next({
        isAuthenticated: true,
        user: session.user,
        token: session.token,
        role
      });
      
      return { success: true, user: session.user };
    }

    // MODE PRODUCCIÓ: usar API
    const response = await fetch(`${API_URL}/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Error en l\'inici de sessió');
    }

    const session = {
      user: data.user,
      token: data.access_token
    };

    // Guardar en localStorage
    localStorage.setItem('userSession', JSON.stringify(session));

    // Actualitzar observable
    authState$.next({
      isAuthenticated: true,
      user: data.user,
      token: data.access_token
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Logout
const logout = () => {
  try {
    localStorage.removeItem('userSession');
    authState$.next({
      isAuthenticated: false,
      user: null,
      token: null,
      role: null
    });
  } catch (error) {
    console.error('Error en logout:', error);
  }
};

// Comprovar si l'usuari està autenticat
const isAuthenticated = () => {
  return authState$.value.isAuthenticated;
};

// Obtenir usuari actual
const getCurrentUser = () => {
  return authState$.value.user;
};

// Obtenir rol actual (per sistema de permisos)
const getUserRole = () => {
  return authState$.value.role || 'user';
};

// Comprovar si l'usuari és admin (sistema de permisos)
const isAdmin = () => {
  return getUserRole() === 'admin';
};

// Funció pura: convertir FormData a JSON
const formDataToJSON = (formData) => {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
};

export {
  authState$,
  initAuthState,
  registre,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getUserRole,
  isAdmin,
  formDataToJSON,
  generateAvatarUrl
};
