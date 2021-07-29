import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

import auth from "./auth";
import account from "./account";
import htmlClass from "./htmlclass";
import config from "./config";
import breadcrumbs from "./breadcrumbs";
import user from "./user";
import role from "./role";
import profile from "./profile";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "ac-esm",
  storage: window.localStorage,
  modules: ["auth"],
});

export default new Vuex.Store({
  modules: {
    auth,
    account,
    htmlClass,
    config,
    breadcrumbs,
    user,
    role,
    profile,
  },
  plugins: [vuexPersist.plugin],
});
