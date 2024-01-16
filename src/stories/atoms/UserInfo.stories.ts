import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import userInfo from '@/components/atoms/UserInfo.vue'
import * as myVal from '@/models/MyInterface'
// import FakerFunc from '@/models/fakerFunc';
// Define the ArgTypes for the storybook without using the generic
const myArgTypes: ArgTypes = {
  'update:ProjectInfo': {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'update:ProjectInfo',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for ProjectInfo addition' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const appUser = myVal.appUserDefault

const meta: Meta<typeof userInfo> = {
  title: 'app/atoms/userInfo',
  component: userInfo,
  argTypes: myArgTypes
}
export default meta

type Story = StoryObj<typeof userInfo>

export const First: Story = {
  render: (args) => ({
    components: { userInfo },
    setup() {
      return { args }
    },
    template: '<userInfo v-bind="args" @update:ProjectInfo= "function1"/>',
    methods: {
      function1: action('update:ProjectInfo')
    }
  }),
  args: {
    appUser
  }
}
