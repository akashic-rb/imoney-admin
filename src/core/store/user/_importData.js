import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  message: null,
});

const getters = {};

const actions = {
  async importData({ commit }, file) {
    commit("LOADING");
    try {
      const res = await API.post("/api/import", file);
      if (res.status === 200) {
        commit("SET_MESSAGE", res.data.message);
        return true;
      }
    } catch (e) {
      commit("SET_ERROR", e.response.data.message);
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
  SET_MESSAGE: (s, message) => (s.message = message),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
