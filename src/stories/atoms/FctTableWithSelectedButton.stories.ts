import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctTableWithSelectButtonVue from '@/components/molecules/FctTableWithSelectButton.vue'
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
  'update:fctFavoriteList': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:fctFavoriteList',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for fctFavoriteList update' // Provide a helpful description
  },
  // ... define other arg types as necessary ...
  'update:fctRowItem': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:fctRowItem',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for fctRowItem update' // Provide a helpful description
  }
}

const meta: Meta<typeof FctTableWithSelectButtonVue> = {
  title: 'app/molecules/FctTableWithSelectButton',
  component: FctTableWithSelectButtonVue,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof FctTableWithSelectButtonVue>

export const Second: Story = {
  render: (args) => ({
    components: { FctTableWithSelectButtonVue },
    setup() {
      return { args }
    },
    template:
      '<FctTableWithSelectButtonVue v-bind="args" @update:fctRowItem="onUpdateFctRowItem" @update:fctFavoriteList="onUpdateFctFavoriteList" />',
    methods: {
      onUpdateFctRowItem: action('update:fctRowItem'),
      onUpdateFctFavoriteList: action('update:fctFavoriteList')
    }
  }),
  args: {
    fct: myFct,
    fctFavoriteList
  }
}
