import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctTableVue from '@/components/atoms/FctTableSingleNutrient.vue'
import * as myVal from '@/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'

const myFct: myVal.FctItems = FakerFunc.createFcts()

const fctFavoriteList: myVal.FctStars = myFct.map((item, index) => {
  const res = index % 2 ? true : false
  return {
    IdStar: item.keyFct,
    Star: res
  }
})

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  rowSelected: {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'row-click',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for rowSelected' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof FctTableVue> = {
  title: 'app/atoms/FctTable',
  component: FctTableVue,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof FctTableVue>

export const Second: Story = {
  render: (args) => ({
    components: { FctTableVue },
    setup() {
      return { args }
    },
    template: '<FctTableVue v-bind="args" @row-click="onRowSelected"/>',
    methods: { onRowSelected: action('onRowSelected') }
  }),
  args: {
    fct: myFct,
    fctFavoriteList
  }
}
