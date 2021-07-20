import getAll from "./_getAll";

/** @type {import('vuex').Module} */
const permissionModule = {
  namespaced: true,
  modules: { getAll },
};

export default permissionModule;
