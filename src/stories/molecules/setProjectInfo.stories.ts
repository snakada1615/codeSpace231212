import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import setProjectInfo from '@/components/molecules/setProjectInfo.vue'
import FakerFunc from '@/models/fakerFunc'
import { faker } from '@faker-js/faker'
import * as myVal from '@/models/MyInterface'
// import * as myVal from '@/models/MyInterface';
// import FakerFunc from '@/models/fakerFunc';
// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:projectInfo': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:projectInfo',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for projectInfo addition' // Provide a helpful description
  },
  saveProjectInfo: {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'saveProjectInfo',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for saveProjectInfo' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const projectInfo = myVal.ProjectInfoDefault

const meta: Meta<typeof setProjectInfo> = {
  title: 'app/molecules/setProjectInfo',
  component: setProjectInfo,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof setProjectInfo>

export const First: Story = {
  render: (args) => ({
    components: { setProjectInfo },
    setup() {
      return { args }
    },
    template:
      '<setProjectInfo v-bind="args" @update:projectInfo="function1" @saveProjectInfo="function2" />',
    methods: {
      function1: action('update:projectInfo'),
      function2: action('saveprojectInfo')
    }
  }),
  args: {
    projectInfo
  }
}

const ProjectInfo2 = {
  ...projectInfo,
  location: 'bus stop',
  projectName: 'myProject1',
  familyMembers: FakerFunc.createFamilyMembers()
}

export const Second: Story = {
  render: (args) => ({
    components: { setProjectInfo },
    setup() {
      return { args }
    },
    template:
      '<setProjectInfo v-bind="args" @update:projectInfo="function1" @saveProjectInfo="function2" />',
    methods: {
      function1: action('update:projectInfo'),
      function2: action('saveprojectInfo')
    }
  }),
  args: {
    projectInfo: ProjectInfo2
  }
}
