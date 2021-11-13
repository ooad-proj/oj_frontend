import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/tailwind.css'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import vueCodeditor from "vue-codeditor";
Vue.component(vueCodeditor)
Vue.config.productionTip = false
Vue.use(mavonEditor)
let vue = new Vue({
  store,
  router,
  vuetify,
  i18n,
  render: h => h(App)
})

vue.$mount('#app')
