// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import myButton from 'src/components/test/myButtons.vue'
import { fn } from '@storybook/test'

const meta: Meta<typeof myButton> = {
  title: 'test/myButton',
  component: myButton,
  args: { onClick: fn() }
}

export default meta
type Story = StoryObj<typeof myButton>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { myButton },
    setup() {
      return {
        onClick: action('clicked-me')
      }
    },
    template: '<myButton @click="onClick" />'
  })
}

export const Secondary: Story = {
  render: (args) => ({
    components: { myButton },
    setup() {
      return { args }
    },
    template: '<myButton v-bind="args" />'
  }),
  args: {
    title: '😄👍😍💯'
  }
}
