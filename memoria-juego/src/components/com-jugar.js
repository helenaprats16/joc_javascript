// com-jugar.js - Pantalla de com es juga (molt bàsica)

class ComJugar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card shadow">
              <div class="card-body p-5">
                <h2 class="text-center mb-4">Com es Juga</h2>
                
                <div class="mb-4">
                  <ol class="fs-6">
                    <li class="mb-2">Clica dos cartes</li>
                    <li class="mb-2">Si són iguals, es queden girades</li>
                    <li class="mb-2">Si no ho són, es tornen a girar</li>
                    <li class="mb-2">Troba totes les parelles!</li>
                  </ol>
                </div>

                <div class="text-center">
                  <a href="#content" class="btn btn-success btn-lg">Jugar Ara</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('com-jugar', ComJugar);

export { ComJugar };