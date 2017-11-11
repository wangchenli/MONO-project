import Vue from 'vue'
import Router from 'vue-router'

import ShopList from '@/view/shoplist/shoplist'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ShopList',
      component: ShopList
    }
  ]
})
