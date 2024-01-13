import { getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { onBeforeUnmount } from 'vue'
const router = useRouter()

export function useAuthListener() {
  const authListener = getAuth().onAuthStateChanged(function (user) {
    if (!user) {
      // not logged in
      alert('you must be logged in to view this. redirecting to the home page')
      router.push('/')
    }
  })
  onBeforeUnmount(() => {
    // clear up listener
    authListener()
  })
}
