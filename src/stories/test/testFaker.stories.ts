import type { Meta, StoryObj } from '@storybook/vue3'
import testFaker from 'src/components/test/testFaker.vue'

const meta: Meta<typeof testFaker> = {
  title: 'Test/Faker',
  component: testFaker
}

export default meta

type Story = StoryObj<typeof testFaker>

export const Secondary: Story = {
  render: (args) => ({
    components: { testFaker },
    setup() {
      return { args }
    },
    template: '<testFaker v-bind="args" />'
  }),
  args: {}
}
