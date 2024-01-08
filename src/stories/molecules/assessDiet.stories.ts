import assessDietVue from '@/components/molecules/assessDiet.vue'
import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:menuItem': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:menuItem',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for MenuItem update' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof assessDietVue> = {
  title: 'app/molecules/assessDietVue',
  component: assessDietVue,
  argTypes: myArgTypes
}

export default meta

type Story = StoryObj<typeof assessDietVue>

export const Primary: Story = {
  render: (args) => ({
    components: { assessDietVue },
    setup() {
      return { args }
    },
    template: '<assessDietVue v-bind="args" @update:menuItem = "onUpdateMenuItem "/>',
    methods: {
      onUpdateMenuItem: action('onUpdateMenuItem')
    }
  }),
  args: {}
}
