import * as bootstrap from "bootstrap";
import { router } from "./router.js";
import { menuJoc } from "./components/header.js";
import { peuPagina } from "./components/footer.js";

document.addEventListener("DOMContentLoaded", () => {
  const appDiv = document.querySelector("#app");
  const header = document.querySelector("#header");
  const footer = document.querySelector("#footer");

  header.innerHTML = menuJoc();
  footer.innerHTML = peuPagina();

  
  router(window.location.hash ,appDiv);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, appDiv);
  });
});
