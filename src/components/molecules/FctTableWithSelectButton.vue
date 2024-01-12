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
  (e: 'newFctRowItem', value: myVal.FctRowItem): void
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

const starComputed = computed({
  get() {
    return (
      props.fctFavoriteList.find((item) => item.IdStar === selectedFct.value.keyFct)?.Star || false
    )
  },
  set(val) {
    onUpdateFctStar(val)
  }
})

const fctAddOptions = ref<myVal.FctAddOptions>({
  NutrientValue: 0,
  Weight: 0,
  MenuName: ''
})

const onUpdateFctStar = (val: boolean) => {
  const res: myVal.FctStars = props.fctFavoriteList.map((item) => {
    return {
      IdStar: item.IdStar,
      Star: item.IdStar === selectedFct.value.keyFct ? val : item.Star
    }
  })
  emits('update:fctFavoriteList', res)
}

const onAddNewFctRowItem = (val: myVal.FctAddOptions) => {
  emits('newFctRowItem', {
    ...selectedFct.value,
    ...val,
    Star: starComputed.value
  })
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
      :fct="selectedFct"
      v-model:fct-add-options="fctAddOptions"
      v-model:star="starComputed"
      @update:fct-add-options="onAddNewFctRowItem"
    />
  </q-card>
</template>
