import API from "@/core/plugins/api";

const state = () => ({
  loading: false,
  error: null,
  data: [],
  total: 0,
  lastPage: 0,
});

const getters = {};

const actions = {
  async getAll({ commit }) {
    commit("LOADING");
    try {
      const res = await API.get("/users");
      commit("SET_DATA", res.data.data.data);
      commit("SET_TOTAL", res.data.data.total);
      commit("SET_TOTALPAGE", res.data.data.last_page);
      return true;
    } catch (e) {
      commit("SET_ERROR", e);
      return false;
    } finally {
      commit("LOADED");
    }
  },
  async filterByName({ commit }, array, keyword) {
    const filtered = array.filter((item) => {
      console.log(keyword);
      item.name.includes(keyword);
    });
    if (filtered.length > 0) {
      commit("SET_DATA", filtered);
    } else {
      commit("SET_DATA", []);
    }
  },
};

const mutations = {
  LOADING: (s) => {
    s.loading = true;
    s.error = null;
    s.data = [];
    s.total = 0;
  },
  LOADED: (s) => (s.loading = false),
  SET_ERROR: (s, error) => (s.error = error),
  SET_DATA: (s, data) => (s.data = data),
  SET_TOTAL: (s, total) => (s.total = total),
  SET_TOTALPAGE: (s, lastPage) => (s.lastPage = lastPage),
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
