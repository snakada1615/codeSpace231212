import type { Meta, StoryObj } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import MenuItemCard from '@/components/atoms/MenuItemCard.vue'
import * as myVal from '@/models/MyInterface'

const menuItem: myVal.MenuItem = {
  key: '04',
  value: 52,
  label: 'Apple',
  FoodGroup: 'Fruits',
  Weight: 152,
  MenuName: 'breakfast',
  Star: false
}

const commonMenus = myVal.commonMenus

const meta: Meta<typeof MenuItemCard> = {
  title: 'app/atoms/MenuItemCard',
  component: MenuItemCard,
  argTypes: {
    'update:Star': {},
    'update:menuName': {}
  }
}
export default meta

type Story = StoryObj<typeof MenuItemCard>

export const Second: Story = {
  render: (args) => ({
    components: { MenuItemCard },
    setup() {
      return { args }
    },
    template:
      '<MenuItemCard v-bind="args" @update:Star="args[\'update:Star\']" @update:menuName="args[\'update:menuName\']" />'
  }),
  args: {
    menuItem: menuItem,
    commonMenus: commonMenus,
    'update:Star': action('emitStar'),
    'update:menuName': action('emitMenuName')
  }
}
