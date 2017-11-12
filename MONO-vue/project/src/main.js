// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


// 安装 yaml-loader 以正确进行语言文件读取
// npm install yaml-loader --save-dev

import vuexI18n from 'vuex-i18n'; 
Vue.use(vuexI18n.plugin, store);  
const translationsEn = {  
    "content": "This is some {type} content"  
};  


  
// translations can be kept in separate files for each language  
// i.e. resources/i18n/de.json.  
// add translations directly to the application  
Vue.i18n.add('en', translationsEn);  
  
// set the start locale to use  
Vue.i18n.set('en');

// vue的图片懒加载插件：vue-lazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/img/error.jpg',
  loading: '/static/img/loading.gif',
  attempt: 1
})

import { Previewer} from 'vux'
Vue.use(Previewer)

//-----滑屏引入的组件----------------------------------
import Resource from 'vue-resource'
// 全局导入组件
Vue.use(Resource);

// 引入路由配置
//import Router from './router.js'
// 引入 VUX-UI 组件
import  { AlertPlugin } from 'vux'
import  { ConfirmPlugin } from 'vux'
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
//--------------------------------------


Vue.config.productionTip = false

import '@/assets/css/app.css'
import '@/assets/js/shipei.js'
import '@/assets/js/base64.js'

/* import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
Vue.use(wcSwiper); */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
