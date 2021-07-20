import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
});

const getters = {};

const actions = {
  async destroy({ commit }, id) {
    commit("LOADING");
    try {
      const res = await API.delete("/api/users/" + id);
      if (res.status === 200) {
        return true;
      }
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
