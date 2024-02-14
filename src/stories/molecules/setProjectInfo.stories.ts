import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import projectData from '@/components/molecules/ProjectData.vue'
import FakerFunc from '@/models/fakerFunc'
// import { faker } from '@faker-js/faker'
import * as myVal from '@/models/myTypes'
// import * as myVal from '@/models/myTypes';
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

const projectInfoDat = FakerFunc.createProject()

const ProjectInfo2 = {
  ...projectInfoDat,
  location: 'okayama',
  projectName: 'myProject1',
  targetPopulation: myVal.familyMembersDefault
}

const meta: Meta<typeof projectData> = {
  title: 'app/molecules/ProjectData',
  component: projectData,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof projectData>

export const First: Story = {
  render: (args) => ({
    components: { projectData },
    setup() {
      return { args }
    },
    template:
      '<projectData v-bind="args" @update:projectInfo="function1" @saveProjectInfo="function2" />',
    methods: {
      function1: action('update:projectInfo'),
      function2: action('saveprojectInfo')
    }
  }),
  args: {
    projectInfo: projectInfoDat
  }
}

export const Second: Story = {
  render: (args) => ({
    components: { projectData },
    setup() {
      return { args }
    },
    template:
      '<projectData v-bind="args" @update:projectInfo="function1" @saveProjectInfo="function2" />',
    methods: {
      function1: action('update:projectInfo'),
      function2: action('saveprojectInfo')
    }
  }),
  args: {
    projectInfo: ProjectInfo2
  }
}
