// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import listItem from 'src/components/atoms/ListItem.vue'
import { type DiversityStates } from 'src/models/MyInterface'

const myItem: DiversityStates = [
  {
    name: 'Starchy roots, tubers and their products',
    status: true
  },
  {
    name: 'Legumes and their products',
    status: false
  },
  {
    name: 'Nuts, seeds and their products',
    status: true
  }
]

const meta: Meta<typeof listItem> = {
  title: 'app/atoms/ListItem',
  component: listItem
}

export default meta

type Story = StoryObj<typeof listItem>

export const Secondary: Story = {
  render: (args) => ({
    components: { listItem },
    setup() {
      return { args }
    },
    template: '<listItem v-bind="args" />'
  }),
  args: {
    diversityStates: myItem
  }
}
