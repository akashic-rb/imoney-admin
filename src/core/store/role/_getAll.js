import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  rolesList: [],
  total: 0,
});

const getters = {};

const actions = {
  async getAllRoles({ commit }) {
    commit("LOADING");
    try {
      const res = await API.get("/roles");
      commit("SET_DATA", res.data.data);
      commit("SET_TOTAL", res.data);
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
  SET_DATA: (s, data) => (s.rolesList = data),
  SET_TOTAL: (s, total) => (s.total = total),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
