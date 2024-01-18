// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { fireFunc } from '@/models/fireFunctions'

// Guard function
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL)
  // routes: myRoute,
})

// Global beforeEach hook for navigation guard
router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      // Assume fireFunc.getCurrentUser() is an async function returning a Promise<boolean>
      const isLoggedIn = await fireFunc.getCurrentUser()
      const allowedPath = ['index', 'test', 'login', 'ErrorPage']

      // Check if the current path is allowed
      const allowed =
        allowedPath.some((path) => to.path.toLowerCase().includes(path.toLowerCase())) ||
        to.path === '/'

      // Redirect to home if the user is not logged in and trying to access a restricted path
      if (!allowed && !isLoggedIn) {
        alert('You have to login first to use this app')
        next({ path: '/' })
      } else {
        next() // Proceed if the path is allowed or if the user is logged in
      }
    } catch (error) {
      console.error(error)
      next(false) // Optionally redirect to a global error page
    }
  }
)

export default router
