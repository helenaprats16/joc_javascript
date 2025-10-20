export { renderContent };

function renderContent() {
  const numCartes = 20;

  const arrayEmojis = [
    "🍉",
    "🥝",
    "🍪",
    "🍖",
    "🥖",
    "🥚",
    "🍔",
    "🍕",
    "🍉",
    "🥝",
    "🍪",
    "🍖",
    "🥖",
    "🥚",
    "🍔",
    "🍕",
    "🫐",
    "🫐",
    "🥗",
    "🥗",
  ]; //cartes

  let emojis_aleatoris = arrayEmojis.sort(() => (Math.random() > 0.5 ? 2 : -1));

  //creem contenidor principal del joc
  const tauler = document.createElement("div");
  tauler.classList.add("tauler");
  tauler.classList.add("blocked"); // impedir clics fins que acabe el timeout

  //Creem les cartes
  for (let i = 0; i < numCartes; i++) {
    const carta = document.createElement("div");
    carta.className = "carta";

    const caraFront = document.createElement("div");
    caraFront.className = "front";
    caraFront.textContent = "❓";

    const caraBack = document.createElement("div");
    caraBack.className = "back";
    caraBack.textContent = emojis_aleatoris[i];

    carta.appendChild(caraFront);
    carta.appendChild(caraBack);

    //Quan es fatja clic a la carta que es gire
    // carta.addEventListener("click", () => {
    //   carta.classList.toggle("girar");
    // });

    tauler.appendChild(carta); /*Anyadir la carta ara al tauler, despres de haber creat el event */

    console.log(carta);
  }

  //creem BOTO REINICIAR PARTIDA com a element real

  const boto = document.createElement("button");
  boto.className = "boto";
  boto.textContent = "Reiniciar";
  boto.addEventListener("click", () => window.location.reload());

  tauler.appendChild(boto);

  //MOSTRAR CARTES INICI PARTIDA
  mostrarCartesInicials(tauler);

  //logica del joc
  afegirLogicaJoc(tauler);

  return tauler;
}

function mostrarCartesInicials(tauler) {
  //Despres de 200 ms afegim la classe .girar a totes les cartes que estan dins del div taules (les mostrem)
  setTimeout(() => {
    tauler
      .querySelectorAll(".carta")
      .forEach((carta) => carta.classList.add("girar"));
  }, 200);

  //despres de 5 segons llevem la classe .girar (les tornem a tancar)

  setTimeout(() => {
    tauler
      .querySelectorAll(".carta")
      .forEach((carta) => carta.classList.remove("girar"));
    tauler.classList.remove("blocked"); //torna a permitir fer clics
  }, 5000);
}



/*LOGICA DEL JOC */
/*- Primer clic guardar carta1
  - Segon clic guardar carta2 i comparar
    - Si son iguals es deixen girades
    - si no son iguals es tornen a tancar les dos cartes pasades 1 segon
    - controlar click extr mentres se procesen les dos cartes a */

function afegirLogicaJoc(tauler) {

  let divParellesEncontrades = document.createElement("div");
  divParellesEncontrades.textContent ="Parelles encertades: 0";
  divParellesEncontrades.className = "contador";
  tauler.appendChild(divParellesEncontrades);
  let contador=0;
  let carta1 = null;
  let carta2 = null;
  let bloquejat = false;

  tauler.addEventListener("click", (e) => {
    
    if (tauler.classList.contains("blocked") || bloquejat) return;

    const carta = e.target.closest(".carta");
    if (!carta) return;

    // evitar clicar la mateixa carta o cartes ja encertades
    if (carta.classList.contains("girar") || carta.classList.contains("matched")) return;

    // Girem la carta clicada
    carta.classList.add("girar");

    // Si no tenim carta1, la guardem 
    if (!carta1) {
      carta1 = carta;
      return;
    }

    // Assignem carta2 i bloquegem més clics mentre comprovem
    carta2 = carta;
    bloquejat = true;

    const emoji1 = carta1.querySelector(".back").textContent;
    const emoji2 = carta2.querySelector(".back").textContent;

    if (emoji1 === emoji2) {
      // Són iguals: les deixem girades i les marquem perquè no es puguin clicar
      carta1.classList.add("matched");
      carta2.classList.add("matched");
      carta1 = null;
      carta2 = null;
      bloquejat = false;

      contador++;
      divParellesEncontrades.textContent=" Parelles encertades: "+contador;

  
      if (contador === 10) {
        setTimeout(() => {
                alert("Enhorabona, has guanyat!");

        }, 200);
      }
    } else {
      // No són iguals: les tanquem després d'un segon
      setTimeout(() => {
        carta1.classList.remove("girar");
        carta2.classList.remove("girar");
        carta1 = null;
        carta2 = null;
        bloquejat = false;
      }, 1000);
    }
  });

   
}