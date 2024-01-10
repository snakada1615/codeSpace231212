// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import DriSelect from 'src/components/molecules/DriSelect.vue'
import type { DriItems, TargetMembers } from '@/models/MyInterface'
import { action } from '@storybook/addon-actions'
import FakerFunc from '@/models/fakerFunc'

const driItems: DriItems = [
  {
    En: 1088.0,
    Fe: 5.8,
    Name: 'child 6-23 month',
    Pr: 11.65,
    Va: 400.0,
    DriId: '0'
  },
  {
    En: 3066.0,
    Fe: 44.4,
    Name: 'lactating',
    Pr: 61.0,
    Va: 850.0,
    DriId: '1'
  },
  {
    En: 2913.0,
    Fe: 24.9,
    Name: 'adolescent all',
    Pr: 52.65,
    Va: 600.0,
    DriId: '2'
  }
]

const targetMembers: TargetMembers = [
  { targetId: '0', Name: 'child under 6 month', count: 0 },
  { targetId: '1', Name: 'child 6-23 month', count: 2 },
  { targetId: '2', Name: 'lactating', count: 1 },
  { targetId: '3', Name: 'adult', count: 3 },
  { targetId: '4', Name: 'pregnant', count: 0 },
  { targetId: '5', Name: 'adolescent all', count: 1 }
]

// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:TargetMember': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:TargetMember',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for TargetMember update' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof DriSelect> = {
  title: 'app/molecules/DriSelect',
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
    template: '<DriSelect v-bind="args" @update:TargetMember="onUpdateTargetMember"/>',
    methods: {
      onUpdateTargetMember: action('onUpdateTargetMember')
    }
  }),
  args: {
    driItems,
    targetMembers
  }
}

export const Second: Story = {
  render: (args) => ({
    components: { DriSelect },
    setup() {
      return { args }
    },
    template: '<DriSelect v-bind="args" @update:TargetMember="onUpdateTargetMember"/>',
    methods: {
      onUpdateTargetMember: action('onUpdateTargetMember')
    }
  }),
  args: {
    driItems: FakerFunc.createDris(),
    targetMembers
  }
}
