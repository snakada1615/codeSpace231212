<script setup lang="ts">
import FctTable from '../atoms/FctTableSingleNutrient.vue'
import FctRowItemCard from '@/components/atoms/FctRowItemCard.vue'
import * as myVal from 'src/models/myTypes'
import { ref, computed, type PropType } from 'vue'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  },

  fctFavoriteList: {
    type: Object as PropType<myVal.FctStars | []>,
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

let selectedFct = ref<myVal.FctItem>(myVal.fctItemDefault)

const fctFavoriteListDefault = props.fct.map((item) => {
  return {
    IdStar: item.keyFct,
    Star: false
  }
})

const fctFavoriteListComputed = computed(() =>
  props.fctFavoriteList.length === 0 ? fctFavoriteListDefault : props.fctFavoriteList
)

function onFctSelected(val: myVal.FctRowItem) {
  // menuItem.value = val
  selectedFct.value = val
}

const starComputed = computed({
  get() {
    return (
      fctFavoriteListComputed.value.find((item) => item.IdStar === selectedFct.value.keyFct)
        ?.Star || false
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
  const res: myVal.FctStars = fctFavoriteListComputed.value.map((item) => {
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
      :fctFavoriteList="fctFavoriteListComputed"
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
