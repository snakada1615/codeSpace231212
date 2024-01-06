import dropdownTest from 'src/components/test/dropdownTest.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'test/dropdownTest',
  component: dropdownTest
} as Meta<typeof dropdownTest>

type Story = StoryObj<typeof dropdownTest>

export const Primary: Story = {
  render: (args) => ({
    components: { dropdownTest },
    setup() {
      return { args }
    },
    template: '<dropdownTest v-bind="args" />'
  }),
  args: {}
}
