import Vue from 'vue'
import Router from 'vue-router'
import note from '@/components/note'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'note',
      component: note
    }
  ]
})
