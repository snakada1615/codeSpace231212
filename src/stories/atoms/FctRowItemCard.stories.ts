import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctRowItemCard from '@/components/atoms/FctRowItemCard.vue'
import * as myVal from '@/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'

const fctRowItem: myVal.FctRowItem = FakerFunc.createFctRowItem()
const fctRowItem2 = JSON.parse(JSON.stringify(fctRowItem))
fctRowItem2.Weight = 'happyDays'

const commonMenus = myVal.commonMenus

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:fctRowItem': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:fctRowItem',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for fctRowItem update' // Provide a helpful description
  },
  setNewFctRowItem: {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'setNewFctRowItem',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for FctRowItem addition' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof FctRowItemCard> = {
  title: 'app/atoms/FctRowItemCard',
  component: FctRowItemCard,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof FctRowItemCard>

export const First: Story = {
  render: (args) => ({
    components: { FctRowItemCard },
    setup() {
      return { args }
    },
    template:
      '<FctRowItemCard v-bind="args"  @update:fctRowItem="onUpdateFctRowItem" @newFctRowItem="onSetNewFctRowItem" />',
    methods: {
      onUpdateFctRowItem: action('update:fctRowItem'),
      onSetNewFctRowItem: action('setNewFctRowItem')
    }
  }),
  args: {
    fctRowItem: fctRowItem,
    commonMenus: commonMenus
  }
}

export const Second: Story = {
  render: (args) => ({
    components: { FctRowItemCard },
    setup() {
      return { args }
    },
    template:
      '<FctRowItemCard v-bind="args"  @update:fctRowItem="onUpdateFctRowItem" @setNewFctRowItem="onSetNewFctRowItem" />',
    methods: {
      onUpdateFctRowItem: action('update:fctRowItem'),
      onSetNewFctRowItem: action('setNewFctRowItem')
    }
  }),
  args: {
    fctRowItem: fctRowItem2,
    commonMenus: commonMenus
  }
}
