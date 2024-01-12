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
  (e: 'newFctRowItem', value: myVal.FctRowItem): void
}>()

const myMenu = computed<myVal.MenuItems>(() => {
  return props.menuItems
})

const fctFavoriteListComp = computed({
  get: () => props.fctFavoriteList,
  set: (val: myVal.FctStars) => {
    emits('update:fctFavoriteList', val)
  }
})
</script>

<template>
  <q-card>
    <FctTableWithSelectButtonVue
      :fct="props.fct"
      v-model:fct-favorite-list="fctFavoriteListComp"
      :common-menus="myVal.commonMenus"
      @new-fct-row-item="emits('newFctRowItem', $event)"
    />
    <menuTable :menuItems="myMenu" />
  </q-card>
</template>
