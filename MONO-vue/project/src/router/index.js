import Vue from 'vue'
import Router from 'vue-router'

import Recommend from '@/views/recommend/reco'
import Find from '@/views/find/find'
import Community from '@/views/community/community'
import Mine from '@/views/mine/mine'
import MusicPlayer from '@/views/musicPlayer/musicPlayer'
import Secondpage from '@/components/second-page/second-page'
import Alert from '@/components/recommend-item/alert'
import Un from '@/components/404/404'
import Undefined from '@/components/404/nopage'
import PubNav from '@/views/recommend/pub-nav/pub-nav'
import Search from '@/views/recommend/search/searchModular'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/find',
      name: 'Find',
      component: Find
    },
    {
      path: '/community',
      name: 'Community',
      component: Community
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    },
    {
      path: '/Secondpage/:id',
      name: 'Secondpage',
      component: Secondpage
    },
    {
      path: '/Alert',
      name: 'Alert',
      component: Alert
    },
    {
      path: '/Un',
      name: 'Un',
      component: Un
    },
    {
      path: '/Undefined',
      name: 'Undefined',
      component: Undefined
    },
    {
      path:"/search",
      name:"Search",
      component:Search
    }
  ]
})
