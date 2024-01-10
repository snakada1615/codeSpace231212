<script setup lang="ts">
import FctTable from '../atoms/FctTableSingleNutrient.vue'
import FctRowItemCard from '../atoms/FctRowItemCard.vue'
import * as myVal from 'src/models/MyInterface'
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

  commonMenus: {
    type: Object as PropType<typeof myVal.commonMenus>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:fctFavoriteList', value: myVal.FctStars): void
  (e: 'update:fctRowItem', value: myVal.FctRowItem): void
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

function onFctSelected(val: myVal.FctRowItem) {
  // menuItem.value = val
  selectedFct.value = val
}

const fctRowItemComputed = computed<myVal.FctRowItem>(() => {
  return {
    ...selectedFct.value,
    NutrientValue: 0,
    Star: (
      props.fctFavoriteList.find((item) => item.IdStar === selectedFct.value.keyFct) ||
      props.fctFavoriteList[0]
    ).Star,
    Weight: 0,
    MenuName: ''
  }
})

function onUpdateFctRowItem(val: { value: myVal.FctRowItem; index: string }) {
  // menuItem.value = val
  switch (val.index) {
    case 'star': {
      const res: myVal.FctStars = props.fctFavoriteList.map((item) => {
        return {
          IdStar: item.IdStar,
          Star: item.IdStar === val.value.keyFct ? val.value.Star : item.Star
        }
      })
      emits('update:fctFavoriteList', res)
      break
    }
    case 'menu':
      emits('update:fctRowItem', val.value)
      break
    case 'weight':
      emits('update:fctRowItem', val.value)
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
    <FctRowItemCard
      :commonMenus="props.commonMenus"
      :fct-row-item="fctRowItemComputed"
      @update:fctRowItem="onUpdateFctRowItem"
    />
  </q-card>
</template>
