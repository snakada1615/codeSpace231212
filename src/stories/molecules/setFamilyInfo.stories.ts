import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import setFamilyInfo from '@/components/molecules/setFamilyInfo.vue'
import FakerFunc from '@/models/fakerFunc'
import { faker } from '@faker-js/faker'
// import * as myVal from '@/models/myTypes';
// import FakerFunc from '@/models/fakerFunc';
// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:familyMembers': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:familyMembers',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for familyMembers addition' // Provide a helpful description
  },
  'update:familyName': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:familyName',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for familyName addition' // Provide a helpful description
  },
  saveFamilyAll: {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'saveFamilyAll',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for saveFamilyAll' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const familyAll = FakerFunc.createHouse()
const familyAll2 = {
  ...familyAll,
  familyName: ''
}
const location = faker.location.city()

const meta: Meta<typeof setFamilyInfo> = {
  title: 'app/molecules/setFamilyInfo',
  component: setFamilyInfo,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof setFamilyInfo>

export const First: Story = {
  render: (args) => ({
    components: { setFamilyInfo },
    setup() {
      return { args }
    },
    template:
      '<setFamilyInfo v-bind="args" @update:familyAll="function1" @saveFamilyAll="function2" />',
    methods: {
      function1: action('update:familyAll'),
      function2: action('saveFamilyAll')
    }
  }),
  args: {
    house: familyAll
  }
}

export const Second: Story = {
  render: (args) => ({
    components: { setFamilyInfo },
    setup() {
      return { args }
    },
    template:
      '<setFamilyInfo v-bind="args" @update:familyAll="function1" @saveFamilyAll="function2" />',
    methods: {
      function1: action('update:familyAll'),
      function2: action('saveFamilyAll')
    }
  }),
  args: {
    house: familyAll2
  }
}
