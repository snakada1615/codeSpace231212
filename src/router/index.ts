// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useAuthState } from '@/stores/mainStore'

// Guard function
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL)
  // routes: myRoute,
})

const myPages = ['setUserInfo', 'setProjectInfo']

function checkParams(page: string) {
  switch (page.slice(1)) {
    case myPages[0]:
      return false
      break

    case myPages[1]:
      return false
      break

    default:
      return true
      break
  }
}

// Global beforeEach hook for navigation guard
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authState = useAuthState()
    const isLoggedIn = authState.isLoggedin
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
  }
)

export default router
