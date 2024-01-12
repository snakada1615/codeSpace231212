// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import DriSelect from 'src/components/atoms/DriSelect.vue'
import * as myVal from '@/models/MyInterface'
import { action } from '@storybook/addon-actions'
import FakerFunc from '@/models/fakerFunc'

const familyMembers: myVal.FamilyMembers = FakerFunc.createFamilyMembers()

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:familyMember': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:familyMember',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for FamilyMember update' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof DriSelect> = {
  title: 'app/atoms/DriSelect',
  component: DriSelect,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof DriSelect>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { DriSelect },
    setup() {
      return { args }
    },
    template: '<DriSelect v-bind="args" @update:familyMember="onUpdateFamilyMember"/>',
    methods: {
      onUpdateFamilyMember: action('onUpdateFamilyMember')
    }
  }),
  args: {
    familyMembers
  }
}
