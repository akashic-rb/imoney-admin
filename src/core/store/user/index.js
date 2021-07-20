import getAll from "./_getAll";
import create from "./_create";
import get from "./_get";
import update from "./_update";
import destroy from "./_destroy";
import groupBy from "./_groupBy";
import changePassword from "./_changePassword";
import forgotPassword from "./_forgotPassword";
import resetPassword from "./_resetPassword";
import importData from "./_importData";

/** @type {import('vuex').Module} */
const userModule = {
  namespaced: true,
  modules: {
    getAll,
    create,
    get,
    update,
    destroy,
    groupBy,
    changePassword,
    forgotPassword,
    resetPassword,
    importData,
  },
};

export default userModule;
