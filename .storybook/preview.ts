import type { Preview } from '@storybook/vue3'

import { setup } from '@storybook/vue3'

import { Quasar } from 'quasar'

setup((app) => {
  app.use(Quasar, {})
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
