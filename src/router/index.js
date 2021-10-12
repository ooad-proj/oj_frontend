import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/foreground/Foreground.vue')
  },
  {
    path: '/admin',
    component: () => import('../views/background/Background.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
