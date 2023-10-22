import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isFirstLogin: false, // Initially, the user hasn't logged in for the first time
  },
  mutations: {
    setFirstLogin(state, value) {
      state.isFirstLogin = value;
    },
  },
  actions: {
  },
  modules: {
  }
})
