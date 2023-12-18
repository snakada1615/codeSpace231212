<script setup lang="ts">
import type { DriItems, TargetMembers } from 'src/models/MyInterface'
import { computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'
import * as calk from 'src/models/MyFunctions'

const props = defineProps({
  targetMembers: {
    type: Object as PropType<TargetMembers>,
    required: true
  },

  driItems: {
    type: Object as PropType<DriItems>,
    required: true
  }
})

const rows = computed<QTableProps['rows']>(() => {
  return calk.getNutritionDemand(props.targetMembers, props.driItems)
})

const columns: QTableProps['columns'] = [
  {
    name: 'item',
    required: true,
    label: 'Item',
    align: 'left',
    field: 'key',
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
</script>

<template>
  <q-table
    class="my-sticky-header-table"
    :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
    flat
    bordered
    dense
    :rows="rows"
    :columns="columns"
    row-key="name"
  />
</template>
