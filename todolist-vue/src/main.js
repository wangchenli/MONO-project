import Vue from 'vue'
import App from './App'

import './assets/css/base.css'
import './assets/css/index.css'

new Vue({
  el: '#app',
  template: '<App/>',
  components:{App: App}
})