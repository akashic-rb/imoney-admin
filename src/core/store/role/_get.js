import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  role: null,
});

const getters = {};

const actions = {
  async get({ commit }, id) {
    commit("LOADING");
    try {
      const res = await API.get("/api/roles/" + id);
      if (res.status === 200) {
        commit("SET_DATA", res.data.data);
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
    s.role = null;
  },
  LOADED: (s) => (s.loading = false),
  SET_ERROR: (s, error) => (s.error = error),
  SET_DATA: (s, data) => (s.role = data),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
