import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
});

const getters = {};

const actions = {
  async create({ commit }, data) {
    commit("LOADING");
    try {
      const res = await API.post("/api/roles", data);
      if (res.status === 200) {
        return true;
      }
    } catch (e) {
      commit(
        "SET_ERROR",
        Object.values(Object.values(e.response)[0].errors)[0][0]
      );
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
