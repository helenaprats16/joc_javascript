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

function router(route,container) {
    if (routes.has(route)) {
        container.innerHTML = routes.get(route)();
    }else{
        container.innerHTML = `<h2>404</h2>`
    }
}