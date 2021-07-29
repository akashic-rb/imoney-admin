import get from "./_get";
import update from "./_update";

/** @type {import('vuex').Module} */
const profileModule = {
  namespaced: true,
  modules: {
    get,
    update,
  },
};

export default profileModule;
