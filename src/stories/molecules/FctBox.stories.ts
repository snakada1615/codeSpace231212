import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctBoxVue from '@/components/molecules/FctBox.vue'
import * as myVal from '@/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'

const myFct: myVal.FctItems = FakerFunc.createFcts()

const fctFavoriteList: myVal.FctStars = myFct.map((item, index) => {
  const res = index % 2 ? true : false
  return {
    Id: item.keyFct,
    Star: res
  }
})

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:model-value': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:model-value',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for FctBox update' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof FctBoxVue> = {
  title: 'app/molecules/FctBox',
  component: FctBoxVue,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof FctBoxVue>

export const Second: Story = {
  render: (args) => ({
    components: { FctBoxVue },
    setup() {
      return { args }
    },
    template: '<FctBoxVue v-bind="args" @update:model-value="onUpdateFctBox"/>',
    methods: {
      onUpdateFctBox: action('onUpdateFctBox')
    }
  }),
  args: {
    fct: myFct,
    fctFavoriteList
  }
}
