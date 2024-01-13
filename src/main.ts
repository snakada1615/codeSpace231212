import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// IMport firebase
import firebase from 'firebase/compat/app'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCeFvsKeAZAVOv-Y3_5YpIt1iz5nLFeslc',
  authDomain: 'ifnanfaapp101.firebaseapp.com',
  projectId: 'ifnanfaapp101',
  storageBucket: 'ifnanfaapp101.appspot.com',
  messagingSenderId: '1024877003239',
  appId: '1:1024877003239:web:bb25aeee1a9216ed7f3d42',
  measurementId: 'G-QD44RZTNSD'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

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
