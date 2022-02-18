import Vue from 'vue'
import App from './App.vue'
import router from './router'
import WaveSurferVue from "wavesurfer.js-vue";

Vue.config.productionTip = false
Vue.use(WaveSurferVue);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
