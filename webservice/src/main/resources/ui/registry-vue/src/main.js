// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/routes';
import Notifications from 'vue-notification';

import './assets/css/bootstrap.css';
import './assets/css/font-awesome.min.css';
import 'animate.css/animate.css';
import './assets/css/style.css';

Vue.config.productionTip = false;

Vue.use(Notifications);

/* eslint-disable no-new */
new Vue({
  el: '#app_container',
  router,
  template: '<App/>',
  components: { App }
});
