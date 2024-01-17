import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { auth } from '@/models/fireFunctions'
import { type User } from 'firebase/auth'
import { useAuthState } from '@/stores/mainStore'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// IMport firebase
// import firebase from 'firebase/compat/app'
// import { auth } from '@/models/fireFunctions'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {} // import Quasar plugins and add here
})

const authState = useAuthState()
auth.onAuthStateChanged((user: User | null) => {
  if (user) {
    //    isLoggedIn.value = true // if we have a user
    authState.setLoginState(true)
  } else {
    //    isLoggedIn.value = false // if we do not
    authState.setLoginState(false)
  }
})

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  // Handle the error globally
  console.error('Global error:', err)
  console.log('Vue instance:', instance)
  console.log('Error info:', info)

  // Add code for UI notifications, reporting or other error handling logic
  router.push({ path: '/ErrorPage', state: { myError: JSON.stringify((err as Error).message) } })
}

app.mount('#app')
