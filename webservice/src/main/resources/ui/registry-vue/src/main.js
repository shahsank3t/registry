// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import BootstrapVue from 'bootstrap-vue';
import router from './router/routes';
import Notifications from 'vue-notification';

import './assets/css/font-awesome.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'animate.css/animate.css';
import './assets/css/style.css';

Vue.use(BootstrapVue);
Vue.use(Notifications);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app_container',
  router,
  template: '<App/>',
  components: { App }
});
