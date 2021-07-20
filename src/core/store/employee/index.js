import getAll from "./_getAll";
import create from "./_create";
import get from "./_get";
import update from "./_update";
import destroy from "./_destroy";

/** @type {import('vuex').Module} */
const userModule = {
  namespaced: true,
  modules: { getAll, create, get, update, destroy },
};

export default userModule;
