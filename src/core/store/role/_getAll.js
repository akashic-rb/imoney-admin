import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  rolesList: [],
  total: 0,
});

const getters = {};

const actions = {
  async getAllRoles({ commit }, { key, except, page, itemsPerPage }) {
    commit("LOADING");
    try {
      const res = await API.get("/api/roles", {
        params: {
          key,
          except,
          page,
          itemsPerPage,
        },
      });
      commit("SET_DATA", res.data.data.data);
      commit("SET_TOTAL", res.data.data.total);
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
