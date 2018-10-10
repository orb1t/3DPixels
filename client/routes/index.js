import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './home';
import Editor from './editor';
import NotFound from './notfound';
import Profile from './profile';

Vue.use(VueRouter);

export default new VueRouter({
  base: __BASENAME__,
  routes: [
    {
      component: Home,
      name: 'home',
      path: '/',
    },
    {
      component: Editor,
      name: 'editor',
      path: '/editor/:id?',
    },
    {
      component: Profile,
      name: 'profile',
      path: '/user/:id',
    },
    {
      component: NotFound,
      name: '404',
      path: '*',
    },
  ],
});
