<script setup lang="ts">
import FctTableWithSelectButtonVue from './FctTableWithSelectButton.vue'
import menuTable from '../atoms/menuTable.vue'
import * as myVal from 'src/models/MyInterface'
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

  menuItems: {
    type: Object as PropType<myVal.MenuItems>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:fctFavoriteList', value: myVal.FctStars): void
  (e: 'update:fctRowItem', value: myVal.FctRowItem): void
  (e: 'update:menuItems', value: myVal.MenuItems): void
}>()

const myMenu = computed<myVal.MenuItems>(() => {
  return props.menuItems
})
</script>

<template>
  <q-card>
    <FctTableWithSelectButtonVue
      :fct="props.fct"
      :fct-favorite-list="props.fctFavoriteList"
      :common-menus="myVal.commonMenus"
      @update:fct-favorite-list="emits('update:fctFavoriteList', $event)"
      @update:fct-row-item="emits('update:fctRowItem', $event)"
    />
    <menuTable :menuItems="myMenu" />
  </q-card>
</template>
