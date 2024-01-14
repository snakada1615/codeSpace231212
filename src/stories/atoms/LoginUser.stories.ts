import type { Meta, StoryObj } from '@storybook/vue3'
import LoginUserVue from '@/components/atoms/LoginDialog.vue'
import { ref } from 'vue'

const openDialog = ref(false)

const meta: Meta<typeof LoginUserVue> = {
  title: 'app/atoms/LoginUser',
  component: LoginUserVue
}
export default meta

type Story = StoryObj<typeof LoginUserVue>

export const Second: Story = {
  render: (args) => ({
    components: { LoginUserVue },
    setup() {
      return { args }
    },
    template: '<LoginUserVue v-bind="args"/>'
  }),
  args: {
    openDialog: true
  }
}
