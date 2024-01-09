<script setup lang="ts">
import FctTable from '../atoms/FctTableSingleNutrient.vue'
import MenuItemCard from '../atoms/MenuItemCard.vue'
import menuTable from '../atoms/menuTable.vue'
import * as myVal from 'src/models/MyInterface'
import myFunc from 'src/models/MyFunctions'
import FakerFunc from 'src/models/fakerFunc'
import { ref, computed, type PropType, toValue } from 'vue'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  },

  fctFavoriteList: {
    type: Object as PropType<myVal.FctStars>,
    required: true
  },

  // menuItem: {
  //   type: Object as PropType<myVal.MenuItem>,
  //   required: true
  // },

  menuItems: {
    type: Object as PropType<myVal.MenuItems>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:fctFavoriteList', value: myVal.FctStars): void
  (e: 'update:menuItems', value: myVal.MenuItems): void
}>()

let selectedFct = ref<myVal.FctItem>({
  keyFct: '',
  FoodGroupId: '',
  FctName: '',
  FoodGroup: '',
  Carb: 0,
  En: 0,
  Fe: 0,
  Fat: 0,
  Pr: 0,
  Va: 0
})

const fctRowItemComputed = computed<myVal.FctRowItem>(() => {
  return {
    ...selectedFct.value,
    NutrientValue: 0,
    Star: (
      props.fctFavoriteList.find((item) => item.Id === selectedFct.value.keyFct) ||
      props.fctFavoriteList[0]
    ).Star,
    Weight: 0,
    MenuName: ''
  }
})

const myMenu = computed<myVal.MenuItems>(() => {
  return props.menuItems
})

const commonMenus = myVal.commonMenus

function onFctSelected(val: myVal.FctRowItem) {
  // menuItem.value = val
  selectedFct.value = val
}

function onUpdateFctRowItem(val: { value: myVal.FctRowItem; index: string }) {
  // menuItem.value = val
  switch (val.index) {
    case 'star':
      const res = props.fctFavoriteList.map((item) => {
        if (item.Id === val.value.keyFct) {
          return val.value
        } else {
          return item
        }
      })
      emits('update:fctFavoriteList', res)
      break
    case 'menu':
      console.log('hi')
      break
    case 'weight':
      console.log('hi')
      break
    default:
      break
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
    <MenuItemCard
      :commonMenus="commonMenus"
      :fct-row-item="fctRowItemComputed"
      @update:fctRowItem="onUpdateFctRowItem"
    />
    <menuTable :menuItems="myMenu" />
  </q-card>
</template>
