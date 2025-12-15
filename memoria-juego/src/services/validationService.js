import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// Funcions pures de validació
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return Boolean(password && password.length >= 6);
};

const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

// Crear observables per a cada camp
const createFieldValidator = (validationFn) => {
  const field$ = new BehaviorSubject('');
  const isValid$ = field$.pipe(
    map(value => validationFn(value))
  );
  
  return { field$, isValid$ };
};

// Validador de formulari de registre
const createRegistreValidator = () => {
  const email = createFieldValidator(isValidEmail);
  const password = createFieldValidator(isValidPassword);
  const confirmPassword = new BehaviorSubject('');
  
  const passwordsMatch$ = combineLatest([
    password.field$,
    confirmPassword
  ]).pipe(
    map(([pass, confirm]) => doPasswordsMatch(pass, confirm))
  );
  
  const isFormValid$ = combineLatest([
    email.isValid$,
    password.isValid$,
    passwordsMatch$
  ]).pipe(
    map(([emailValid, passValid, passMatch]) => 
      emailValid && passValid && passMatch
    )
  );
  
  return {
    email,
    password,
    confirmPassword,
    passwordsMatch$,
    isFormValid$
  };
};

// Validador de formulari de login
const createLoginValidator = () => {
  const email = createFieldValidator(isValidEmail);
  const password = createFieldValidator(isValidPassword);
  
  const isFormValid$ = combineLatest([
    email.isValid$,
    password.isValid$
  ]).pipe(
    map(([emailValid, passValid]) => emailValid && passValid)
  );
  
  return {
    email,
    password,
    isFormValid$
  };
};

// Afegir classe d'error a un element
const addErrorClass = (element, hasError) => {
  if (hasError) {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
  } else {
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
  }
};

// Mostrar missatge d'error
const showErrorMessage = (container, message) => {
  let errorDiv = container.querySelector('.invalid-feedback');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    container.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
};

export {
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
  createRegistreValidator,
  createLoginValidator,
  addErrorClass,
  showErrorMessage
};
