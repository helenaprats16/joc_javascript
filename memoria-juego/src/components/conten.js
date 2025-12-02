export { renderContent };

// Constants del joc en valencià
const TOTAL_CARTES = 20;
const TEMPS_MOSTRAR_INICIAL = 200;     
const TEMPS_OCULTAR_INICIAL = 5000;    
const TEMPS_ERROR_PARELLA = 1000;      
const TEMPS_VICTORIA = 1000;
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
  

function renderContent() {  
  const tauler = crearTaulerJoc();
  afegirLogicaJoc(tauler);
  mostrarCartesInicials(tauler);
  return tauler;


}

function crearTaulerJoc(){
//array aleatori dels emojis
  let emojis_aleatoris = arrayEmojis.sort(() => (Math.random() > 0.5 ? 2 : -1));


//creem contenidor principal del joc
  const tauler = document.createElement("div");
  tauler.classList.add("tauler");
  tauler.classList.add("blocked"); // impedir clics fins que acabe el timeout

  //Creem les cartes
  for (let i = 0; i < TOTAL_CARTES; i++) {
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
    tauler.appendChild(carta); /*Anyadir la carta ara al tauler, despres de haber creat el event */

    console.log(carta);
  }

  //creem BOTO REINICIAR PARTIDA 

  const boto = document.createElement("button");
  boto.className = "boto";
  boto.textContent = "Reiniciar";
  boto.addEventListener("click", () => window.location.reload());

  tauler.appendChild(boto);

  return tauler;

}


function mostrarCartesInicials(tauler) {
  //Despres de 200 ms afegim la classe .girar a totes les cartes que estan dins del div taules (les mostrem)
  setTimeout(() => {
    tauler
      .querySelectorAll(".carta")
      .forEach((carta) => carta.classList.add("girar"));
  }, TEMPS_MOSTRAR_INICIAL);

  //despres de 5 segons llevem la classe .girar (les tornem a tancar)

  setTimeout(() => {
    tauler
      .querySelectorAll(".carta")
      .forEach((carta) => carta.classList.remove("girar"));
    tauler.classList.remove("blocked"); //torna a permitir fer clics
  }, TEMPS_OCULTAR_INICIAL);
}


/***********************************************************************/
/*LOGICA DEL JOC */
/*- Primer clic guardar carta1
  - Segon clic guardar carta2 i comparar
    - Si son iguals es deixen girades
    - si no son iguals es tornen a tancar les dos cartes pasades 1 segon
    - controlar clicks externs mentres se procesen les dos cartes  */

function afegirLogicaJoc(tauler) {

  //1º Crear el marcador
  const marcador = crearMarcador();
  tauler.appendChild(marcador);


  //2º Inicialitzar el estat del joc
  let carta1 = null;
  let carta2 = null;
  let bloquejat = false;
  let contador=0;
  const totalParelles = 10;

  //3º Funcio per gestionar cada clic de cart
 
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
      marcador.textContent=" Parelles encertades: "+contador;

  
      if (contador === totalParelles) {
        setTimeout(() => {
                alert("Enhorabona, has guanyat!");

        }, TEMPS_VICTORIA);
      }
    } else {
      // No són iguals: les tanquem després d'un segon
      setTimeout(() => {
        carta1.classList.remove("girar");
        carta2.classList.remove("girar");
        carta1 = null;
        carta2 = null;
        bloquejat = false;
      }, TEMPS_ERROR_PARELLA);
    }
  });

   
}

function crearMarcador(){
  let divParellesEncontrades = document.createElement("div");
  divParellesEncontrades.textContent ="Parelles encertades: 0";
  divParellesEncontrades.className = "contador";
  return divParellesEncontrades;
}
