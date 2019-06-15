import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './components/global'  //全局注册组件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
