export default {
  namespaced: true,
  state: {
    classes: {},
  },
  getters: {
    getClasses: (state) => (position) => {
      if (typeof position !== "undefined") {
        return state.classes[position];
      }
      return state.classes;
    },
  },
  actions: {
    addBodyClassName(context, className) {
      document.body.classList.add(className);
    },
    removeBodyClassName(context, className) {
      document.body.classList.remove(className);
    },
    addClassName(context, payload) {
      context.commit("SET_CLASSNAME_BY_POSITION", payload);
    },
  },
  mutations: {
    SET_CLASSNAME_BY_POSITION(state, payload) {
      const { position, className } = payload;
      if (!state.classes[position]) {
        state.classes[position] = [];
      }
      state.classes[position].push(className);
    },
  },
};
