import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctRowItemCard from '@/components/atoms/FctRowItemCard.vue'
import * as myVal from '@/models/myTypes'
import FakerFunc from '@/models/fakerFunc'

const fct: myVal.FctItem = FakerFunc.createFct(myVal.sampleFood)
const fctAddOptions: myVal.FctAddOptions = FakerFunc.createFctAddOptions()
const fctAddOptions2 = JSON.parse(JSON.stringify(fctAddOptions))
fctAddOptions2.Weight = 'happyDays'

const commonMenus = myVal.commonMenus

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:fctAddOptions': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:fctAddOptions',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for fctAddOptions addition' // Provide a helpful description
  },
  'update:star': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:star',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for star addition' // Provide a helpful description
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
      '<FctRowItemCard v-bind="args"  @update:fctAddOptions="onNewFctRowItem" @update:star="onUpdateFctStar" />',
    methods: {
      onNewFctRowItem: action('update:fctAddOptions'),
      onUpdateFctStar: action('update:star')
    }
  }),
  args: {
    fct,
    fctAddOptions,
    star: false,
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
      '<FctRowItemCard v-bind="args"  @update:fctAddOptions="onNewFctRowItem" @update:star="onUpdateFctStar" />',
    methods: {
      onNewFctRowItem: action('update:fctAddOptions'),
      onUpdateFctStar: action('update:star')
    }
  }),
  args: {
    fct,
    fctAddOptions: fctAddOptions2,
    star: false,
    commonMenus: commonMenus
  }
}
