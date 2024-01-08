<script setup lang="ts">
import FctTable from '../atoms/FctTableSingleNutrient.vue'
import MenuItemCard from '../atoms/MenuItemCard.vue'
import menuTable from '../atoms/menuTable.vue'
import * as myVal from 'src/models/MyInterface'
import myFunc from 'src/models/MyFunctions'
import FakerFunc from 'src/models/fakerFunc'
import { ref, computed, type PropType } from 'vue'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  },

  fctFavoriteList: {
    type: Object as PropType<myVal.FctStars>,
    required: true
  },

  menuItem: {
    type: Object as PropType<myVal.MenuItem>,
    required: true
  },

  menuItems: {
    type: Object as PropType<myVal.MenuItems>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:fct', value: myVal.FctItems): void
  (e: 'update:menuItem', value: myVal.MenuItem): void
  (e: 'update:menuItems', value: myVal.MenuItems): void
}>()

// const myFct: myVal.FctItems = FakerFunc.createFcts()

// const fctFavoriteList: myVal.FctStars = myFct.map((item, index) => {
//   const res = index % 2 ? true : false
//   return {
//     Id: item.keyFct,
//     Star: res
//   }
// })

// const menuItemOrg: myVal.MenuItem = {
//   keyFct: '04',
//   NutrientValue: 52,
//   FctName: 'Apple',
//   FoodGroup: 'Fruits',
//   Weight: 152,
//   MenuName: 'breakfast',
//   Star: false,
//   En: 0,
//   Pr: 0,
//   Va: 0,
//   Fe: 0,
//   Carb: 0,
//   Fat: 0,
//   IdMenuItem: '00',
//   KeyFamily: 'John',
//   Date: new Date(),
//   FoodGroupId: 'string'
// }

const menuItem = ref(props.menuItem)

const myMenu: myVal.MenuItems = FakerFunc.createMenuItems()

const commonMenus = myVal.commonMenus

function onFctSelected(val: myVal.FctRowItem) {
  // menuItem.value = val
  menuItem.value = {
    ...val,
    NutrientValue: 0,
    Star: false,
    Weight: 0,
    MenuName: '',
    IdMenuItem: '00',
    KeyFamily: '',
    Date: new Date()
  }
}
</script>

<template>
  <q-card>
    <FctTable
      :fct="props.fct"
      :fctFavoriteList="props.fctFavoriteList"
      @row-click="onFctSelected"
    />
    <MenuItemCard :commonMenus="commonMenus" v-model:menu-item="menuItem" />
    <menuTable :menuItems="props.menuItems" />
  </q-card>
</template>
