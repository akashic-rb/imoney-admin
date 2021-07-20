import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  permissionsList: [],
});

const getters = {};

const actions = {
  async getAllPermissions({ commit }) {
    commit("LOADING");
    try {
      const res = await API.get("/api/permissions");
      commit("SET_DATA", res.data.data);
      return res;
    } catch (e) {
      commit("SET_ERROR", e);
      return false;
    } finally {
      commit("LOADED");
    }
  },
};

const mutations = {
  LOADING: (s) => {
    s.loading = true;
    s.error = null;
  },
  LOADED: (s) => (s.loading = false),
  SET_ERROR: (s, error) => (s.error = error),
  SET_DATA: (s, data) => (s.permissionsList = data),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
