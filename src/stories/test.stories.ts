// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import myTest01 from 'src/components/test/myTest01.vue'

const meta: Meta = {
  component: myTest01
}

export default meta

type Story = StoryObj<typeof myTest01>

export const Secondary: Story = {
  render: (args) => ({
    components: { myTest01 },
    setup() {
      return { args }
    },
    template: '<myTest01 v-bind="args" />'
  }),
  args: {
    targetMembers: 'myItem'
  }
}
