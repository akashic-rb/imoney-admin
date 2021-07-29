import API from "@/core/plugins/api";

const state = () => ({
  infoLoading: false,
  error: null,
  profile: null,
});

const getters = {};

const actions = {
  async get({ commit }) {
    commit("LOADING");
    try {
      const res = await API.get("/user-info");
      if (res.data.is_success) {
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
    s.infoLoading = true;
    s.error = null;
    s.profile = null;
  },
  LOADED: (s) => (s.infoLoading = false),
  SET_ERROR: (s, error) => (s.error = error),
  SET_DATA: (s, data) => (s.profile = data),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
