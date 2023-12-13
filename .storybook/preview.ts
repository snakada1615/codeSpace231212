import { app } from '@storybook/vue3'
import Quasar from 'quasar'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Here we can add Quasar plugin options, icon sets, etc.
const quasarConfig = {
  plugins: {} // Add any of Quasar plugins you are using
  // ...other Quasar options
}

// Apply Quasar plugin with the configuration
app.use(Quasar, quasarConfig)

export const parameters = {
  // ... other parameters
}
