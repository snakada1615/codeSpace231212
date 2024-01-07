<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { type ComputedRef, ref, computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'

const props = defineProps({
  menuItems: {
    type: Object as PropType<myVal.MenuItems>,
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

const rowsMenuItem: ComputedRef<myVal.MenuItems> = computed(() => {
  return props.menuItems
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
