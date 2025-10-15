export { renderContent };

function renderContent() {
  const numCartes = 20;

  const arrayCartes = [
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

  let emojis_aleatoris = arrayCartes.sort(() => (Math.random() > 0.5 ? 2 : -1));

  //creem contenidor principal del joc
  const tauler = document.createElement("div");
  tauler.classList.add("tauler");

  //Creem les cartes
  for (let i = 0; i < numCartes; i++) {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.textContent = emojis_aleatoris[i];
    tauler.appendChild(carta);

    // const caraFront = document.createElement("div");
    // caraFront.className = "front";

    // caraFront.textContent = "❓";

    // const caraBack = document.createElement("div");
    // caraBack.className = "back";
    // caraBack.textContent = emojis_aleatoris[i];

    // carta.appendChild(caraFront);
    // carta.appendChild(caraBack);


    console.log(carta);

    // //Quan es fatja clic a la carta que es gire
    // carta.addEventListener("click", () => {
    //   carta.classList.toggle("girada");
    // });
  }

  tauler.innerHTML +=
    '<button class="boto" onclick="window.location.reload()">Reiniciar</button>';

  //retornem el contenidor completament, amb innerHTML retorna el que hi ha dins del div tauler no a partir del div tauler
  return tauler.outerHTML;
}
