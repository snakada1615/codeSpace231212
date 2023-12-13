// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'

import myDialogue from 'src/components/testComponents/myDialogue.vue'

const meta: Meta<typeof myDialogue> = {
  component: myDialogue
}

export default meta
type Story = StoryObj<typeof myDialogue>

export const Primary: Story = {
  name: 'I am the primary',
  render: () => ({
    components: { myDialogue },
    template: '<myDialogue />'
  })
}
