import Vue from 'vue'
import VueRouter from 'vue-router'

import LoginView from '../views/foreground/login/LoginView.vue'
import UserInfoView from '../views/foreground/auth/UserInfoView.vue'
import ChangeInfoView from '../views/foreground/auth/ChangeInfoView.vue'


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/foreground/Foreground.vue'),
    children: [
      {
        path: 'login',
        component: LoginView
      },
      {
        path: 'user/info',
        component: UserInfoView
      },
      {
        path: 'user/edit',
        component: ChangeInfoView
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('../views/background/Background.vue'),
    children:[
      {
        path:'user',
        name: 'UserManagement',
        component: () => import('../views/background/user/UserManagement.vue'),
      },
      {
        path:'group',
        name: 'GroupManagement',
        component: () => import('../views/background/group/GroupManagement.vue'),
      },
      {
        path:'group/:groupId',
        name: 'GroupInfo',
        component: () => import('../views/background/group/GroupInfo.vue'),
      },
      {
        path:'problem',
        name: 'ProblemManagement',
        component: () => import('../views/background/problem/ProblemManagement.vue'),
      },
      {
        path:'competition',
        name: 'CompetitionManagement',
        component: () => import('../views/background/competition/CompetitionManagement.vue'),
      }
    ]
    
  }
]

const router = new VueRouter({
  routes
})

export default router
