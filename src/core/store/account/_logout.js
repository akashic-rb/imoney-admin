import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
});

const getters = {};

const actions = {
  async logout({ commit }) {
    commit("LOADING");
    try {
      await API.post("/api/logout");
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
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
