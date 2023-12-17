// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import listItem from 'src/components/test/listItem.vue'
interface diversityState {
  name: string
  status: boolean
}

const diversityStatus: diversityState[] = [
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
    diversityStatus
  }
}
