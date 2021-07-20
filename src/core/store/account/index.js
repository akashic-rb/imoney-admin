import login from "./_login";
import logout from "./_logout";
import getInfor from "./_getInfor";

/** @type {import('vuex').Module} */
const accountModule = {
  namespaced: true,
  modules: { login, logout, getInfor },
};

export default accountModule;
