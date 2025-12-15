import { registre as registreService } from '../services/authService.js';
import { createRegistreValidator, addErrorClass, showErrorMessage } from '../services/validationService.js';

class RegistreForm extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupValidation();
  }

  render() {
    this.innerHTML = `
      <section class="vh-100 bg-image">
        <div class="mask d-flex align-items-center h-100 gradient-custom-3">
          <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
              <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                <div class="card" style="border-radius: 15px;">
                  <div class="card-body p-5">
                    
                    <h2 class="text-uppercase text-center mb-4">Crea un compte</h2>

                    <form id="registreForm">

                      <div class="form-outline mb-4">
                        <input type="email" id="email" name="email" class="form-control form-control-lg" placeholder="Email" required/>
                        <div class="invalid-feedback"></div>
                      </div>

                      <div class="form-outline mb-4">
                        <input type="password" id="contrasenya" name="password" class="form-control form-control-lg" placeholder="Contrasenya" required/>
                        <div class="invalid-feedback"></div>
                      </div>

                      <div class="form-outline mb-4">
                        <input type="password" id="contrasenya-repeat" name="confirmPassword" class="form-control form-control-lg" placeholder="Repetir contrasenya" required/>
                        <div class="invalid-feedback"></div>
                      </div>

                      <div class="d-flex justify-content-center">
                        <button id="boto" type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" disabled>
                          Registre
                        </button>
                      </div>

                      <p class="text-center text-muted mt-5 mb-0">
                        ¿Tens ja un compte? 
                        <a href="#login" class="fw-bold text-body"><u>Iniciar sessió</u></a>
                      </p>

                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  setupValidation() {
    const formElement = this.querySelector('#registreForm');
    const emailInput = this.querySelector('#email');
    const passwordInput = this.querySelector('#contrasenya');
    const confirmPasswordInput = this.querySelector('#contrasenya-repeat');
    const submitBtn = this.querySelector('#boto');
    
    const validator = createRegistreValidator();
    
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
    
    confirmPasswordInput.addEventListener('input', (e) => {
      validator.confirmPassword.next(e.target.value);
    });
    
    validator.passwordsMatch$.subscribe(isMatch => {
      if (confirmPasswordInput.value.length > 0) {
        addErrorClass(confirmPasswordInput, !isMatch);
        if (!isMatch) {
          showErrorMessage(confirmPasswordInput.parentElement, 'Les contrasenyes no coincideixen');
        }
      }
    });
    
    validator.isFormValid$.subscribe(isValid => {
      submitBtn.disabled = !isValid;
    });
    
    formElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(formElement);
      const textOriginal = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrant...';
      
      try {
        await registreService(formData);
        alert('Registre correcte! Ara pots iniciar sessió.');
        window.location.hash = '#login';
      } catch (error) {
        alert(`Error: ${error.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = textOriginal;
      }
    });
  }
}

customElements.define('registre-form', RegistreForm);

export { RegistreForm };
