import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import MenuItemCard from '@/components/atoms/FctRowItemCard.vue'
import * as myVal from '@/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'

const fctRowItem: myVal.FctRowItem = FakerFunc.createFctRowItem()

const commonMenus = myVal.commonMenus

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:menuItem': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:menuItem',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for menuItem update' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof MenuItemCard> = {
  title: 'app/atoms/MenuItemCard',
  component: MenuItemCard,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof MenuItemCard>

export const Second: Story = {
  render: (args) => ({
    components: { MenuItemCard },
    setup() {
      return { args }
    },
    template: '<MenuItemCard v-bind="args"  @update:fctRowItem="onUpdateFctRowItem" />',
    methods: {
      onUpdateFctRowItem: action('update:fctRowItem')
    }
  }),
  args: {
    fctRowItem: fctRowItem,
    commonMenus: commonMenus
  }
}
