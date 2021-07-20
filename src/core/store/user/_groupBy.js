import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  data: null,
});

const getters = {};

const actions = {
  async groupBy({ commit }, { column, team }) {
    commit("LOADING");
    try {
      const res = await API.get("/api/usersGroupBy", {
        params: {
          column,
          team,
        },
      });
      commit("SET_DATA", res.data.data);
      return true;
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
  SET_DATA: (s, data) => (s.data = data),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
