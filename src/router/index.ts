import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ErrorPage from '../components/atoms/ErrorPage.vue'
import RegisterUserVue from '@/views/RegisterUser.vue'
import feedTestVue from '@/views/feedTest.vue'
import LoginUserVue from '@/views/LoginUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/myTest01.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'ErrorPage',
      component: ErrorPage
    },
    {
      path: '/errorPage',
      name: 'ErrorPage',
      component: ErrorPage
    },
    {
      path: '/registUser',
      name: 'RegisterUser',
      component: RegisterUserVue
    },
    {
      path: '/loginUser',
      name: 'LoginUser',
      component: LoginUserVue
    },
    {
      path: '/feedTest',
      name: 'feedTestVue',
      component: feedTestVue
    }
  ]
})

export default router
