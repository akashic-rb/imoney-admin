import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
});

const getters = {};

const actions = {
  async create({ commit }, formData) {
    commit("LOADING");
    try {
      const res = await API.post("/users", formData);
      if (res.status === 200) {
        return true;
      }
    } catch (e) {
      commit("SET_ERROR", Object.values(e.response.data.error)[0][0]);
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
