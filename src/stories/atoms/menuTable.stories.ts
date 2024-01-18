import type { Meta, StoryObj } from '@storybook/vue3'
import menuTableVue from '@/components/atoms/menuTable.vue'
import * as myVal from '@/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'

const myMenu: myVal.Menu = FakerFunc.createMenu()

const meta: Meta<typeof menuTableVue> = {
  title: 'app/atoms/menuTable',
  component: menuTableVue
}
export default meta

type Story = StoryObj<typeof menuTableVue>

export const Second: Story = {
  render: (args) => ({
    components: { menuTableVue },
    setup() {
      return { args }
    },
    template: '<menuTableVue v-bind="args" />'
  }),
  args: {
    menu: myMenu
  }
}
