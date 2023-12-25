<script setup lang="ts">
import type { DriItems, TargetMembers, TargetMember } from 'src/models/MyInterface'
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

const emits = defineEmits<{
  (e: 'update:TargetMember', value?: TargetMembers): void
  (e: 'dummy', value: string): void
}>()

function updateTarget(index: string, val: number) {
  // targetの変更内容を親コンポーネントにemit
  const newTarget: TargetMembers = props.targetMembers.map((item) => {
    let countTemp = item.count
    if (index === item.targetId) {
      countTemp = val
    }
    return {
      targetId: item.targetId,
      count: countTemp
    }
  })

  emits('update:TargetMember', newTarget)
}

const rows = computed<QTableProps['rows']>(() => {
  return calk.getNutritionDemand(props.targetMembers, props.driItems)
})

const columns: QTableProps['columns'] = [
  {
    name: 'item',
    required: true,
    label: 'Item',
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

const rows2 = computed<QTableProps['rows']>(() => {
  return props.driItems.map((item) => {
    // targetで人数が設定されている場合はそれを利用、それ以外は0を設定
    const res = props.targetMembers.find((sameId: TargetMember) => sameId.targetId === item.id)

    return {
      id: item.id,
      Name: item.Name,
      count: res ? res.count : 0
    }
  })
})

const columns2: QTableProps['columns'] = [
  {
    name: 'item',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'Name',
    sortable: true
  },
  {
    name: 'val',
    required: true,
    label: 'Value',
    align: 'left',
    field: 'count',
    sortable: true
  }
]
</script>

<template>
  <q-table
    class="my-sticky-header-table q-my-md"
    :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
    flat
    bordered
    dense
    :rows="rows2"
    :columns="columns2"
    row-key="name"
  >
    <template v-slot:body="props2">
      <q-tr :props="props2">
        <q-td key="item" :props="props2"> {{ props2.row.Name }} </q-td>
        <q-td key="val" :props="props2">
          <q-input
            v-model="props2.row.count"
            @update:model-value="(newValue) => updateTarget(props2.row.id, Number(newValue))"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

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
