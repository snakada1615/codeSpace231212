import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import FctBoxVue from '@/components/molecules/FctBox.vue'
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

const meta: Meta<typeof FctBoxVue> = {
  title: 'app/molecules/FctBox',
  component: FctBoxVue,
  argTypes: {
    'update:model-value': {}
  }
}
export default meta

type Story = StoryObj<typeof FctBoxVue>

export const Second: Story = {
  render: (args) => ({
    components: { FctBoxVue },
    setup() {
      return { args }
    },
    template: '<FctBoxVue v-bind="args" @update:model-value="args[\'update:model-value\']"/>'
  }),
  args: {
    fct: myFct,
    fctFavoriteList,
    'update:model-value': action('emit')
  }
}