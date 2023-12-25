// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import test01Vue from '@/components/test/test01.vue'

const meta: Meta = {
  component: test01Vue
}

export default meta

type Story = StoryObj<typeof test01Vue>

export const Secondary: Story = {
  render: (args) => ({
    components: { test01Vue },
    setup() {
      return { args }
    },
    template: '<test01Vue v-bind="args" />'
  }),
  args: {
    diversityStates: myItem
  }
}
