export { registre, dades, supaBase };

function registre() {
  /*Test: Ha de retornar un element HTML */
  const log = `<section class="vh-100 bg-image">
  <div class="mask d-flex align-items-center h-100 gradient-custom-3">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card" style="border-radius: 15px;">
            <div class="card-body p-5">
              
              <h2 class="text-uppercase text-center mb-4">Crea un conter</h2>

              <form id="registreForm">

                <div class="form-outline mb-4">
                  <input type="email" id="email" class="form-control form-control-lg" placeholder="Email"/>
                </div>

                <div class="form-outline mb-4">
                  <input type="password" id="contrasenya" class="form-control form-control-lg" placeholder="Contrasenya"/>
                </div>

                <div class="form-outline mb-4">
                  <input type="password" id="contrasenya-repeat" class="form-control form-control-lg" placeholder="Repetir contrasenya"/>
                </div>

                <div class="d-flex justify-content-center">
                  <button id="boto" type="button" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                    Registre
                  </button>
                </div>

                <p class="text-center text-muted mt-5 mb-0">
                  ¿Tens ja un conter? 
                  <a href="#login" class="fw-bold text-body"><u>Iniciar sessio</u></a>
                </p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
  /*Test: ha de redirigirse a dades() */
  const div = document.createElement("div");
  div.innerHTML = log;
  dades(div);
  return div;
}

/**
 * Test: Afegir els esdeveniments i vincular amb supaBase()
 */
function dades(registre) {
  let boto = registre.querySelector("#boto");
  let email = registre.querySelector("#email");
  let contrasenya = registre.querySelector("#contrasenya");
  let contrasenya_repeat = registre.querySelector("#contrasenya-repeat");

  boto.addEventListener("click", async () => {
    // Validaciones...
    
    const textOriginal = boto.textContent;
    boto.disabled = true;
    boto.textContent = "Registrant...";
    
    try {
      const exito = await supaBase(email, contrasenya);
      
      // Solo restaurar si NO tuvo éxito (no redirigió)
      if (!exito) {
        boto.disabled = false;
        boto.textContent = textOriginal;
      }
      
    } catch (error) {
      // Error de red o similar
      boto.disabled = false;
      boto.textContent = textOriginal;
      alert("Error: " + error.message);
    }
  });
}


/*Funcio asincrona per conectarse a la base de dades i fer un post de les dades de registre */
async function supaBase(email, constrasenya) {
  let response = await fetch(
    "https://myxgvoawkaigibajyllt.supabase.co/auth/v1/signup",
    {
      method: "POST",
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15eGd2b2F3a2FpZ2liYWp5bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzk0NzMsImV4cCI6MjA3NjYxNTQ3M30.0tTkn-fo0KhrCD3gAxJMjaXGUcElVjy4l60c_0s2U1c",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: constrasenya.value,
      }),
    }
  );

  let data = await response.json();

  console.log(data.message);

  if (data.code == 422) {
    alert(data.message || "Error en les dades introduides");
    return false;
  } else {
    alert("CREACIO DE CONTER CORRECTAMENT");
    window.location.href = "#login"; //es redirigeix a la pagina de login
    return true;
  }
  
}
