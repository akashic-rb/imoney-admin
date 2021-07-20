const state = () => ({
  user: {},
  token: "",
  errors: {},
});

const getters = {
  isLoggedIn(s) {
    return Boolean(s.token);
  },
};

const actions = {
  setAuth({ commit }, payload) {
    commit("SET_AUTH", payload);
  },
  purgeAuth({ commit }) {
    commit("PURGE_AUTH");
  },
};

const mutations = {
  SET_AUTH: (s, payload) => {
    s.token = payload.token;
    s.user = payload.user;
  },
  PURGE_AUTH: (s) => {
    Object.assign(s, state());
  },
};

export default {
  namespaced: true,
  state: state(),
  actions,
  mutations,
  getters,
};
