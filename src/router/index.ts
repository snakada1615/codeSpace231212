import { createRouter, createWebHistory } from 'vue-router'
// import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
// import { isAuthenticated } from './auth' // Your auth module with TypeScript types
import { fireFunc } from '@/models/fireFunctions'

// Guard function
import HomeView from '../views/HomeView.vue'
import ErrorPage from '../components/atoms/ErrorPage.vue'
import feedTestVue from '@/views/feedTest.vue'
import myTest01Vue from '../views/myTest01.vue'
import setProjectInfoVue from '@/components/molecules/setProjectInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      path: '/feedTest',
      name: 'feedTestVue',
      component: feedTestVue,
      meta: { requiresAuth: true }
    },
    {
      path: '/myTest01',
      name: 'myTest01Vue',
      component: myTest01Vue
    },
    {
      path: '/setProjectInfo',
      name: 'setProjectInfo',
      component: setProjectInfoVue,
      meta: { requiresAuth: true }
    }
  ]
})

// Guard function
// async function checkAuth(
//   to: RouteLocationNormalized,
//   from: RouteLocationNormalized,
//   next: NavigationGuardNext
// ) {
//   const currentUser = await fireFunc.getCurrentUser()
//   console.log(currentUser)
//   if (to.meta.requiresAuth && !currentUser) {
//     alert('you have to login first to use this app')
//     next({ name: 'home' })
//   } else {
//     next()
//   }
// }

// Global beforeEach hook for navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    // await checkAuth(to, from, next)
    const currentUser = await fireFunc.getCurrentUser()
    console.log(currentUser)
    if (to.meta.requiresAuth && !currentUser) {
      alert('you have to login first to use this app')
      next({ name: 'home' })
    } else {
      next()
    }
    // Set page title or perform other global checks here.
  } catch (error) {
    console.error(error)
    next(false) // Optionally redirect to a global error page
  }
})

export default router
