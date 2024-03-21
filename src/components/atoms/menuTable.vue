<script setup lang="ts">
import * as myVal from '@/models/myTypes'
import { type ComputedRef, computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'

const props = defineProps({
  menu: {
    type: Object as PropType<myVal.Menu>,
    required: true
  }
})

// 列の定義
const columnsMenuItem: QTableProps['columns'] = [
  {
    name: 'menuName',
    required: true,
    label: 'menuName',
    align: 'left',
    field: 'MenuName',
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
    name: 'Wt',
    required: true,
    label: 'Wt',
    align: 'left',
    field: 'Weight',
    sortable: true
  },
  {
    name: 'En',
    required: true,
    label: 'En',
    align: 'left',
    field: 'En',
    sortable: true
  },
  {
    name: 'Pr',
    required: true,
    label: 'Pr',
    align: 'left',
    field: 'Pr',
    sortable: true
  },
  {
    name: 'Va',
    required: true,
    label: 'Va',
    align: 'left',
    field: 'Va',
    sortable: true
  },
  {
    name: 'Fe',
    required: true,
    label: 'Fe',
    align: 'left',
    field: 'Fe',
    sortable: true
  }
]

const rowsMenuItem: ComputedRef = computed(() => {
  return {
    MenuName: props.menu.menu,
    FctName: props.menu.data[0].FctName,
    Weight: props.menu.data[0].Weight,
    En: props.menu.data[0].En,
    Pr: props.menu.data[0].Pr,
    Va: props.menu.data[0].Va,
    Fe: props.menu.data[0].Fe
  }
})
</script>

<template>
  <q-table
    :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
    flat
    bordered
    dense
    :rows="rowsMenuItem"
    :columns="columnsMenuItem"
  />
</template>
11
