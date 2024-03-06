import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dialog, Notify, Loading } from 'quasar'
import { auth } from '@/models/fireFunctions'
import { type User } from 'firebase/auth'
import { useAuthState, useProjectData } from '@/stores/mainStore'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Loading
  }
})

const authState = useAuthState()
const projectData = useProjectData()

auth.onAuthStateChanged(async (user: User | null) => {
  if (user) {
    //    isLoggedIn.value = true // if we have a user
    authState.setLoginState(true)
    // projectData.setUserId(user.uid) // keep uid in pinia
    projectData.updateStateValue('appUser', { ...projectData.appUser, userId: user.uid }) // keep uid in pinia
    await projectData.fireGetAllData(user.uid) // download user data
  } else {
    //    isLoggedIn.value = false // if we do not
    authState.setLoginState(false)
    // projectData.setUserId('') // delete uid in pinia
    projectData.updateStateValue('appUser', { ...projectData.appUser, userId: '' }) // keep uid in pinia
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
