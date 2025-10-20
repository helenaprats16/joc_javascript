import { login } from "./components/login.js";
import { renderContent } from './components/conten.js';
import { registre } from "./components/registre.js";
export {router}

const routes = new Map([
    ['#',renderContent],
    ['#content',renderContent],
    ['#login',login],
    ['#registre', registre]

])

function mountResult(container, result) {
  if (result instanceof HTMLElement) {
    container.innerHTML = '';
    container.appendChild(result);
  } else {
    container.innerHTML = String(result);
  }
}

function router(route, container) {
  if (!container) return;
  const handler = routes.get(route);
  if (handler) {
    const result = handler();
    mountResult(container, result);
  } else {
    container.innerHTML = '<h2>404</h2>';
  }
}