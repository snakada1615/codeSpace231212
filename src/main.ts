import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

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
  plugins: {} // import Quasar plugins and add here
})

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  // Handle the error globally
  console.error('Global error:', err)
  console.log('Vue instance:', instance)
  console.log('Error info:', info)

  // Add code for UI notifications, reporting or other error handling logic
  router.push({ name: 'ErrorPage', state: { myError: JSON.stringify((err as Error).message) } })
}

app.mount('#app')
