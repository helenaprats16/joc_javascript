import * as bootstrap from 'bootstrap';
import { login as loginService } from '../services/authService.js';
import { createLoginValidator, addErrorClass, showErrorMessage } from '../services/validationService.js';

export { login };

function login() {
  const form = `<section class="vh-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <form id="loginForm">
              <h2 class="fw-bold mb-2 text-uppercase">Inici sessió</h2><br><br>
              
              <div class="form-outline form-white mb-4">
                <input type="email" id="typeEmailX" name="email" class="form-control form-control-lg" placeholder="Email" required/>
                <div class="invalid-feedback"></div>
              </div>

              <div class="form-outline form-white mb-4">
                <input type="password" id="typePasswordX" name="password" class="form-control form-control-lg" placeholder="Contrasenya" required/>
                <div class="invalid-feedback"></div>
              </div>
              
              <button class="btn btn-outline-light btn-lg px-5" type="submit" id="jugar" disabled>JUGAR</button>
            </form>

            <div class="mt-4">
              <p class="mb-0">No tens un compte? <a href="#registre" class="text-white-50 fw-bold">Registrar-me</a></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;

  const loginContainer = document.createElement('div');
  loginContainer.innerHTML = form;
  
  // Afegir lògica reactiva amb RxJS
  setupLoginValidation(loginContainer);
  
  return loginContainer;
}

function setupLoginValidation(container) {
  const formElement = container.querySelector('#loginForm');
  const emailInput = container.querySelector('#typeEmailX');
  const passwordInput = container.querySelector('#typePasswordX');
  const submitBtn = container.querySelector('#jugar');
  
  const validator = createLoginValidator();
  
  // Subscriure's als canvis d'email
  emailInput.addEventListener('input', (e) => {
    validator.email.field$.next(e.target.value);
  });
  
  validator.email.isValid$.subscribe(isValid => {
    if (emailInput.value.length > 0) {
      addErrorClass(emailInput, !isValid);
      if (!isValid) {
        showErrorMessage(emailInput.parentElement, 'Email invàlid');
      }
    }
  });
  
  // Subscriure's als canvis de contrasenya
  passwordInput.addEventListener('input', (e) => {
    validator.password.field$.next(e.target.value);
  });
  
  validator.password.isValid$.subscribe(isValid => {
    if (passwordInput.value.length > 0) {
      addErrorClass(passwordInput, !isValid);
      if (!isValid) {
        showErrorMessage(passwordInput.parentElement, 'Mínim 6 caràcters');
      }
    }
  });
  
  // Activar/desactivar botó segons validació
  validator.isFormValid$.subscribe(isValid => {
    submitBtn.disabled = !isValid;
  });
  
  // Gestionar enviament del formulari
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(formElement);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrant...';
    
    try {
      await loginService(formData);
      window.location.hash = '#content';
    } catch (error) {
      alert(`Error: ${error.message}`);
      submitBtn.disabled = false;
      submitBtn.textContent = 'JUGAR';
    }
  });
}
