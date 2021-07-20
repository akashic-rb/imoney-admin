import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  users: [],
  total: 0,
});

const getters = {};

const actions = {
  async search({ commit }, { key, page }) {
    commit("LOADING");
    try {
      const res = await API.get("/api/users", {
        params: {
          key,
          page,
        },
      });
      if (res.status === 200) {
        commit("SET_DATA", res.data.data.data);
        commit("SET_TOTAL", res.data.data.total);
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
  SET_DATA: (s, data) => (s.users = data),
  SET_TOTAL: (s, total) => (s.total = total),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
