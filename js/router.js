// import { reactive } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import { reactive } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import Login from "./modules/auth/login.js";
import POS from "./modules/pos/pos.js";

const state = reactive({
  currentRoute: "pos", // ganti dari "login"
});

const routes = {
  login: Login,
  pos: POS,
};

export const router = {
  go(route) {
    state.currentRoute = route;
  },
  logout() {
    state.currentRoute = "login";
  },
  currentView() {
    return routes[state.currentRoute];
  },
  isLogin() {
    return state.currentRoute === "login";
  },
};
