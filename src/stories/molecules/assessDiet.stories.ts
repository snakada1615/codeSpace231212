import assessDietVue from '@/components/molecules/assessDiet.vue'
import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import * as myVal from 'src/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'
import { faker } from '@faker-js/faker'

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
  addMenuItem: {
    control: 'object', // Adjust this control as needed, e.g., 'text' if you want a string input
    action: 'addMenuItem',
    table: {
      category: 'Events' // Optional: Use categories to organize your argTypes
    },
    description: 'Event for menuItem update' // Provide a helpful description
  }
  // ... define other arg types as necessary ...
}

const meta: Meta<typeof assessDietVue> = {
  title: 'app/molecules/assessDietVue',
  component: assessDietVue,
  argTypes: myArgTypes
}

export default meta

type Story = StoryObj<typeof assessDietVue>

const myFct: myVal.FctItems = FakerFunc.createFcts()
const myFctFavoriteList: myVal.FctStars = myFct.map((item) => {
  return {
    IdStar: item.keyFct,
    Star: faker.datatype.boolean()
  }
})
const myMenuItems: myVal.MenuItems = FakerFunc.createMenuItems()

export const Primary: Story = {
  render: (args) => ({
    components: { assessDietVue },
    setup() {
      return { args }
    },
    template:
      '<assessDietVue v-bind="args" @addMenuItem = "onAddMenuItem" @update:fctFavoriteList = "onUpdateFctFavoriteList" />',
    methods: {
      onAddMenuItem: action('addMenuItem'),
      onUpdateFctFavoriteList: action('onUpdateFctFavoriteList')
    }
  }),
  args: {
    fct: myFct,
    fctFavoriteList: myFctFavoriteList,
    menuItems: myMenuItems
  }
}
