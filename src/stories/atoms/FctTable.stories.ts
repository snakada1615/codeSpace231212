import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctTableVue from '@/components/atoms/FctTable.vue'
import * as myVal from '@/models/MyInterface'
import FakerFunc from '@/models/fakerFunc'

const myFct: myVal.FctItems = FakerFunc.createFcts()

const fctFavoriteList: myVal.FctStars = myFct.map((item, index) => {
  const res = index % 2 ? true : false
  return {
    Id: item.Id,
    Star: res
  }
})

const meta: Meta<typeof FctTableVue> = {
  title: 'app/atoms/FctTable',
  component: FctTableVue,
  argTypes: {
    rowSelected: {}
  }
}
export default meta

type Story = StoryObj<typeof FctTableVue>

export const Second: Story = {
  render: (args) => ({
    components: { FctTableVue },
    setup() {
      return { args }
    },
    template: '<FctTableVue v-bind="args" @rowSelected="args[\'rowSelected\']"/>'
  }),
  args: {
    fct: myFct,
    fctFavoriteList,
    rowSelected: action('emit')
  }
}
