import objectPath from "object-path";
import merge from "deepmerge";
import config from "@/core/config/layout.config.json";

export default {
  namespaced: true,
  state: {
    config: config,
    initial: config,
  },
  getters: {
    /**
     * Get config from layout config
     * @param state
     * @returns {function(path, defaultValue): *}
     */
    layoutConfig: (state) => (path, defaultValue) => {
      return objectPath.get(state.config, path, defaultValue);
    },
  },
  actions: {
    /**
     * Set and replace the whole config
     * @param state
     * @param payload
     */
    setLayoutConfig(state, payload) {
      state.commit("SET_LAYOUT_CONFIG", payload);
    },

    /**
     * Reset the config at the initial state
     * @param state
     */
    resetLayoutConfig(state) {
      state.commit("RESET_LAYOUT_CONFIG");
    },

    /**
     * Reset the config using saved config in the cache by the layout builder
     * @param state
     */
    overrideLayoutConfig(state) {
      state.commit("OVERRIDE_LAYOUT_CONFIG");
    },

    /**
     * Override config by page level
     * @param state
     * @param payload
     */
    overridePageLayoutConfig(state, payload) {
      state.commit("OVERRIDE_PAGE_LAYOUT_CONFIG", payload);
    },
  },
  mutations: {
    SET_LAYOUT_CONFIG: (state, payload) => {
      state.config = payload;
    },
    RESET_LAYOUT_CONFIG: (state) => {
      state.config = Object.assign({}, state.initial);
    },
    OVERRIDE_LAYOUT_CONFIG: (state) => {
      state.config = state.initial = Object.assign(
        {},
        state.initial,
        JSON.parse(localStorage.getItem("config"))
      );
    },
    OVERRIDE_PAGE_LAYOUT_CONFIG: (state, payload) => {
      state.config = merge(state.config, payload);
    },
  },
};
