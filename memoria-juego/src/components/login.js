import * as bootstrap from 'bootstrap';
export {login}

function login() {
  const form= `<section class="vh-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-3 pb-3" href="#joc">

              <h2 class="fw-bold mb-2 text-uppercase">Inici sessio</h2><br><br>
              <div data-mdb-input-init class="form-outline form-white mb-4">
                <input type="email" id="typeEmailX" class="form-control form-control-lg"  placeholder="Email"/>
              </div>

              <div data-mdb-input-init class="form-outline form-white mb-4">
                <input type="password" id="typePasswordX" class="form-control form-control-lg" placeholder="Password"/>
              </div>
              <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" type="submit" id="jugar">JUGAR</button>
            </div>

            <div>
              <p class="mb-0">No tens un conter? <a href="#registre" id ="registre-Usuari" class="text-white-50 fw-bold">Registrar-me</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

  const login =document.createElement("div");
  login.innerHTML=form;
  return login;


}
