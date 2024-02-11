<script setup lang="ts">
import FctTableWithSelectButtonVue from './FctTableWithSelectButton.vue'
import menuTable from '../atoms/menuTable.vue'
import * as myVal from 'src/models/myTypes'
import { computed, type PropType } from 'vue'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  },

  fctFavoriteList: {
    type: Object as PropType<myVal.FctStars | null>,
    required: true
  },

  menu: {
    type: Object as PropType<myVal.Menu | []>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:fctFavoriteList', value: myVal.FctStars): void
  (e: 'addMenuItem', value: myVal.MenuItem): void
}>()

const myMenu = computed<myVal.Menu>(() => {
  return props.menu
})

const fctStarDefault: myVal.FctStars = props.fct.map((item) => {
  return {
    IdStar: item.keyFct,
    Star: false
  }
})

const fctFavoriteListComp = computed({
  get: () => props.fctFavoriteList || fctStarDefault,
  set: (val: myVal.FctStars) => {
    emits('update:fctFavoriteList', val)
  }
})

const addMenuItem = (val: myVal.FctRowItem) => {
  const res = JSON.parse(JSON.stringify(myMenu.value))
  res.push({
    ...val,
    IdMenuItem: '',
    KeyFamily: '',
    Date: new Date()
  })
  emits('addMenuItem', res)
}
</script>

<template>
  <q-card>
    <FctTableWithSelectButtonVue
      :fct="props.fct"
      v-model:fct-favorite-list="fctFavoriteListComp"
      :common-menus="myVal.commonMenus"
      @new-fct-row-item="addMenuItem"
    />
    <menuTable :menu="myMenu" />
  </q-card>
</template>
