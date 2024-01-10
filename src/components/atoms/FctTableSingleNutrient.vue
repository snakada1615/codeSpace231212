<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { type Ref, ref, computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'
import myFunc from 'src/models/MyFunctions'
import fakerFunc from 'src/models/fakerFunc'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItems>,
    required: true
  },
  fctFavoriteList: {
    type: Object as PropType<myVal.FctStars>,
    required: true
  }
})

const emits = defineEmits<{ (e: 'row-click', value: myVal.FctRowItem): void }>()

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

// star付きの作物のみ表示
const showFavorite = ref(false)

// 列の定義
const columnsFct: QTableProps['columns'] = [
  {
    name: 'star',
    required: true,
    label: '☆',
    align: 'left',
    field: 'Star',
    sortable: true
  },
  {
    name: 'commodity',
    required: true,
    label: 'Commodity',
    align: 'left',
    field: 'FctName',
    sortable: true
  },
  {
    name: 'val',
    required: true,
    label: 'Value',
    align: 'left',
    field: 'NutrientValue',
    sortable: true
  }
]

// FCT表示用の行設定。追ってフィルタリング
const rowsFct = computed(() => {
  const orgList = props.fct.map((item) => {
    return {
      ...item,
      NutrientValue: 200,
      Weight: 0,
      Star: props.fctFavoriteList.find((item2) => item2.IdStar === item.keyFct)?.Star || false
    }
  })

  // ユーザー入力に基づいて抽出
  let filteredList1 = orgList
  if (filterOption.value) {
    filteredList1 = orgList.filter(
      (v) => v.FctName.toLowerCase().indexOf(filterOption.value.toLowerCase()) > -1
    )
  }

  // 食品群で抽出
  let filteredList2 = filteredList1
  if (filterOption2.value && filterOption2.value !== 'all') {
    filteredList2 = filteredList1.filter(
      (v) => v.FoodGroup.toLowerCase().indexOf(filterOption2.value.toLowerCase()) > -1
    )
  }

  // お気に入り「starred」のみ抽出
  let fileredList3 = filteredList2
  if (showFavorite.value) {
    fileredList3 = filteredList2.filter((v) => v.Star === true)
  }

  return fileredList3
})

// 行の選択
const tempFctItem = fakerFunc.createFct(myVal.sampleFood)

const rowItemOrg = {
  ...tempFctItem,
  NutrientValue: 200,
  Star: true,
  Weight: 234
}

const selectedRow = ref(rowItemOrg)

// 選択された行をemit
const onRowClick = (event: Event, row: myVal.FctRowItem): void => {
  selectedRow.value = row
  emits('row-click', row)

  // You can handle the row click event here.
  // For example, navigate to a different page or display details about the row.
}
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
    <q-checkbox dense size="sm" v-model="showFavorite" label="show favorite only" color="teal" />

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
      @row-click="onRowClick"
    >
      <template v-slot:body-cell-star="props">
        <q-td :props="props">
          <div>
            <q-icon :name="props.row.Star ? 'star' : 'star_border'" :color="'primary'"></q-icon>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>
