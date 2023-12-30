import testMe from 'src/components/test/testMe.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'

export default {
  title: 'test/testMe',
  component: testMe,
  argTypes: {
    'button:click': {}
  }
} as Meta<typeof testMe>

type Story = StoryObj<typeof testMe>

export const Primary: Story = {
  render: (args) => ({
    components: { testMe },
    setup() {
      return { args }
    },
    template: '<testMe @button:click="args[\'button:click\']" />'
  }),
  args: {
    'button:click': action('button-click') // Registers an action for the "button:click" event
  }
}
