import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import { fn } from '@storybook/test' // Correctly import fn

import setFamilyInfo from '@/components/molecules/setFamilyInfo.vue'
import FakerFunc from '@/models/fakerFunc'
import { faker } from '@faker-js/faker'

const familyAll = FakerFunc.createHouse()

// Metadata for your Storybook
const meta: Meta<typeof setFamilyInfo> = {
  title: 'app/molecules/setFamilyInfo',
  component: setFamilyInfo,
  args: {
    updateFamilyAll: fn() // Use fn() here if it's needed
    // Make sure your component emits an event named 'update:familyName'
  }
}

export default meta

type Story = StoryObj<typeof setFamilyInfo>
export const First: Story = {
  render: (args) => ({
    components: { setFamilyInfo },
    setup() {
      // Create a spy function for the custom event 'update:familyAll'
      return {
        updateFamilyAll: action('clicked-me'),
        args
      }
    },
    template: `
      <setFamilyInfo v-bind="args" @update:house="updateFamilyAll" />
    `
  }),
  args: {
    house: familyAll
  }
}
