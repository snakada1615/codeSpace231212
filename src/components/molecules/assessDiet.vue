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

const fctIndex = ref(0)

const fctRowItemComputed = computed<myVal.FctRowItem>({
  get: () => ({
    ...props.fct[fctIndex.value],
    NutrientValue: 0,
    Star: props.fctFavoriteList[fctIndex.value].Star,
    Weight: 0,
    MenuName: ''
  }),
  set: (value) => emits('changeItem', value)
})

const myMenu: myVal.MenuItems = FakerFunc.createMenuItems()

const commonMenus = myVal.commonMenus

function onFctSelected(val: myVal.FctRowItem) {
  // menuItem.value = val
  fctRowItemComputed.value = {
    ...val,
    NutrientValue: 0,
    Star: false,
    Weight: 0,
    MenuName: ''
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
    <MenuItemCard :commonMenus="commonMenus" :fct-row-item="fctRowItemComputed" />
    <menuTable :menuItems="props.menuItems" />
  </q-card>
</template>
