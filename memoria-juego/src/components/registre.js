export { registre };

function registre() {
  const log = `<section class="vh-100 bg-image">
  <div class="mask d-flex align-items-center h-100 gradient-custom-3">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card" style="border-radius: 15px;">
            <div class="card-body p-5">
              <h2 class="text-uppercase text-center mb-5">Crea un conter</h2>

              <form>
                 <div data-mdb-input-init class="form-outline mb-4">
                  <input type="email" id="email" class="form-control form-control-lg" placeholder="Email"/>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input type="password" id="contrasenya" class="form-control form-control-lg" placeholder="Contrasenya"/>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input type="password" id="contrasenya-repeat" class="form-control form-control-lg" placeholder="Repetir contrasenya"/>
                </div>

                <div class="d-flex justify-content-center">
                  <button id="boto" type="button" data-mdb-button-init
                    data-mdb-ripple-init class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">Registre</button>
                </div>

                <p class="text-center text-muted mt-5 mb-0" >¿Tens ja un conter? <a href="#login"
                    class="fw-bold text-body"><u>Inicia sessió</u></a></p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

  const registre = document.createElement("div");
  registre.innerHTML = log;

  let boto = registre.querySelector("#boto");
  


  let nom = registre.querySelector("#nom");
  let email = registre.querySelector("#email");
  let contrasenya = registre.querySelector("#contrasenya");
  let contrasenya_repeat = registre.querySelector("#contrasenya-repeat");

  boto.addEventListener("click", () => {
    console.log("click al boto d'inici de sessio");
    console.log(nom.value+" "+email.value+" "+contrasenya.value+" "+contrasenya_repeat.value);
  });

  

  return registre;
}
