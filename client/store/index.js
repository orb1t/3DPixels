import Vue from 'vue';
import Vuex from 'vuex';
import editor from './editor';
import home from './home';
import user from './user';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    editor,
    home,
    user,
  },
  strict: !__PRODUCTION__,
});

store.dispatch('user/initAuth');

export default store;
