import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/core/store";

Vue.config.productionTip = false;

// Global 3rd party plugins
import "popper.js";
import "tooltip.js";
import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import ClipboardJS from "clipboard";
window.ClipboardJS = ClipboardJS;

// Vue 3rd party plugins
import i18n from "@/core/plugins/vue-i18n";
import vuetify from "@/core/plugins/vuetify";
import "@/core/plugins/portal-vue";
import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/highlight-js";
import "@/core/plugins/inline-svg";
import "@/core/plugins/apexcharts";
import "@/core/plugins/metronic";
import "@mdi/font/css/materialdesignicons.css";
import Notifications from "vue-notification";
import "@/core/extensions/vue-notification/style.scss";

Vue.use(Notifications);

router.beforeEach((to, from, next) => {
  // Ensure we checked auth before each page load.
  // Promise.all([store.dispatch(VERIFY_AUTH)]).then(next);
  next();
  // reset config to initial state
  store.dispatch("config/resetLayoutConfig");

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
