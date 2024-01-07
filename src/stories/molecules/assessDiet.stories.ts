import assessDietVue from '@/components/molecules/assessDiet.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof assessDietVue> = {
  title: 'app/molecules/assessDietVue',
  component: assessDietVue
}

export default meta

type Story = StoryObj<typeof assessDietVue>

export const Primary: Story = {
  render: (args) => ({
    components: { assessDietVue },
    setup() {
      return { args }
    },
    template: '<assessDietVue v-bind="args" />'
  }),
  args: {}
}
