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
    component: () => import('../views/background/Background.vue'),
    children:[
      {
        path:'userManger',
        name: 'UserManager',
        component: () => import('../views/background/userManager/UserManager.vue'),
      },
      {
        path:'labManager',
        name: 'LabManager',
        component: () => import('../views/background/labManager/LabManager.vue'),
      },
      {
        path:'problemManager',
        name: 'ProblemManager',
        component: () => import('../views/background/problemManager/ProblemManager.vue'),
      },
      {
        path:'competitionManager',
        name: 'CompetitionManager',
        component: () => import('../views/background/competitionManager/CompetitionManager.vue'),
      }
    ]
    
  },
  {
    path: '/homework',
    component: () => import('../views/homework/homework.vue'),
 
  }
]

const router = new VueRouter({
  routes
})

export default router
