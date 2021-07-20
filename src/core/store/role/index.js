import getAll from "./_getAll";
import get from "./_get";
import update from "./_update";
import create from "./_create";
import destroy from "./_destroy";

/** @type {import('vuex').Module} */
const roleModule = {
  namespaced: true,
  modules: { getAll, get, update, create, destroy },
};

export default roleModule;
