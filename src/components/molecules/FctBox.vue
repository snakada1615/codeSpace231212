<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { type Ref, ref, computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'
import myFunc from 'src/models/MyFunctions'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  }
})

// 対象となる栄養素の一覧
const nutrientLabels = myVal.nutrientLabels

// 選択された栄養素のObject
const nutrientLabel: Ref<myVal.nutrientLabel> = ref(nutrientLabels[0])

// 選択された栄養素のラベル
const targetNutrient = computed<keyof myVal.FctItem>(() => {
  return nutrientLabel.value.value
})

// 対象となる作物群の一覧
let commodityGroups = myFunc.uniq(
  props.fct.map((item) => {
    return item.FoodGroup
  })
)
commodityGroups.push('all')

// 作物リスト用のフィルター（作物名）
const filterOption: Ref<string> = ref('')

// 作物リスト用のフィルター（作物群）
const filterOption2: Ref<string> = ref('all')

const columnsFct: QTableProps['columns'] = [
  {
    name: 'commodity',
    required: true,
    label: 'Commodity',
    align: 'left',
    field: 'label',
    sortable: true
  },
  {
    name: 'val',
    required: true,
    label: 'Value',
    align: 'left',
    field: 'value',
    sortable: true
  }
]

const rowsFct = computed(() => {
  const orgList = props.fct.map((item) => {
    return {
      key: item.Id,
      value: item[targetNutrient.value],
      label: item.Name,
      FoodGroup: item.FoodGroup
    }
  })
  let filteredList1 = []
  if (filterOption.value) {
    filteredList1 = orgList.filter(
      (v) => v.label.toLowerCase().indexOf(filterOption.value.toLowerCase()) > -1
    )
  } else {
    filteredList1 = orgList
  }
  let filteredList2 = []
  if (filterOption2.value && filterOption2.value !== 'all') {
    filteredList2 = filteredList1.filter(
      (v) => v.FoodGroup.toLowerCase().indexOf(filterOption2.value.toLowerCase()) > -1
    )
  } else {
    filteredList2 = filteredList1
  }

  return filteredList2
})
</script>

<template>
  <q-card class="bg-grey-2 q-pa-sm">
    <div class="row q-my-md">
      <div class="col-4">
        <q-input v-model="filterOption" label="Filter" dense>
          <template v-slot:append>
            <q-icon
              name="clear"
              size="1rem"
              @click="filterOption = ''"
              class="cursor-pointer q-mr-sm"
            />
          </template>
        </q-input>
      </div>
      <div class="col-4">
        <q-select
          v-model="filterOption2"
          :options="commodityGroups"
          label="Target foodGroup"
          dense
        />
      </div>
      <div class="col-4">
        <q-select v-model="nutrientLabel" :options="nutrientLabels" label="Target Nutrient" dense />
      </div>
    </div>
    <!-- FCT -->
    <q-table
      class="my-sticky-header-table"
      :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
      flat
      bordered
      dense
      :rows="rowsFct"
      :columns="columnsFct"
      row-key="name"
    />
  </q-card>
</template>
