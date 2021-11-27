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
    path: '/unauthorized',
    component: () => import('../views/UnauthorizedView.vue')
  },
  {
    path: '/',
    redirect: '/home',
    name: 'home',
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
      {
        path: 'problemSet',
        component: () => import('../views/foreground/problem/ProblemListView.vue'),
      },
      {
        path: 'problem/:problemId',
        name: 'problemPage',
        component: () => import('../views/foreground/problem/ProblemView.vue'),
      },
      {
        path: 'problem/:problemId/judge',
        name: 'judgePage',
        component: () => import('../views/foreground/problem/judge/judgeView.vue'),
      },
      {
        path: 'contest',
        component: () => import('../views/foreground/contest/GroupView.vue'),
      },
      {
        path: 'contest/:groupId',
        name:'contestInGroup',
        component: () => import('../views/foreground/contest/group/contestInGroupView.vue'),
      },
      {
        path: 'contest/rank/:contestId',
        name:'contestRank',
        component: () => import('../views/foreground/contest/group/contestRankView.vue'),
      },
      {
        path: 'contest/:groupId/:contestId',
        name:'problemIncontest',
        component: () => import('../views/foreground/contest/group/problem/problemInContest.vue'),
      },
      {
        path: 'home',
        name:'homePage',
        component: () => import('../views/foreground/home/homePage.vue'),
      },
      {
        path: 'rank',
        name:'rankPage',
        component: () => import('../views/foreground/rank/rank.vue'),
      },
      {
        path: 'record',
        name:'recordPage',
        component: () => import('../views/foreground/record/record.vue'),
      },
    ]
  },
  {
    path: '/admin',
    name: 'admin',
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
        path:'problem/answer/:problemId',
        name: 'answerOfProblem',
        component: () => import('../views/background/problem/answer/answerOfProblemView.vue'),
      },
      {
        path: 'problem/createProblem/:contestId',
        name: 'createProblem',
        component: () => import('../views/background/problem/createProblem.vue'),
      },
      {
        path:'competition',
        name: 'CompetitionManagement',
        component: () => import('../views/background/competition/CompetitionManagement.vue'),
      },
      {
        path:'competition/:contestId',
        name: 'contestInfo',
        component: () => import('../views/background/competition/contestInfo.vue'),
      },
    ]
    
  }
]

const router = new VueRouter({
  routes
})

export default router
