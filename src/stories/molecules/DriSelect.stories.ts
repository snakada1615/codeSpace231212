// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import DriSelect from 'src/components/molecules/DriSelect.vue'
import type { DriItems, TargetMembers } from '@/models/MyInterface'
import { action } from '@storybook/addon-actions'

const driItems: DriItems = [
  {
    En: 1088.0,
    Fe: 5.8,
    max_vol: 900,
    Name: 'child 6-23 month',
    Pr: 11.65,
    Va: 400.0,
    id: '0'
  },
  {
    En: 3066.0,
    Fe: 44.4,
    max_vol: 2500,
    Name: 'lactating',
    Pr: 61.0,
    Va: 850.0,
    id: '1'
  },
  {
    En: 2913.0,
    Fe: 24.9,
    max_vol: 2600,
    Name: 'adolescent all',
    Pr: 52.65,
    Va: 600.0,
    id: '2'
  }
]
const targetMembers: TargetMembers = [{ targetId: '2', Name: 'adolescent all', count: 2 }]

const meta: Meta<typeof DriSelect> = {
  title: 'app/molecules/DriSelect',
  component: DriSelect,
  argTypes: {
    'update:TargetMember': {}
  }
}
export default meta

type Story = StoryObj<typeof DriSelect>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => ({
    components: { DriSelect },
    setup() {
      return { args }
    },
    template: '<DriSelect v-bind="args" @update:TargetMember="args[\'update:TargetMember\']"/>'
  }),
  args: {
    driItems,
    targetMembers,
    'update:TargetMember': action('hit')
  }
}
