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
}>()

function updateTarget(index: string, val: number) {
  // targetの変更内容を親コンポーネントにemit
  let newTarget: TargetMembers
  if (rowsFamilyMember.value) {
    newTarget = rowsFamilyMember.value.map((item) => {
      // targetで人数が設定されている場合はそれを利用、それ以外は0を設定
      const myCount = index === item.targetId ? val : item.count

      return {
        targetId: item.targetId,
        Name: item.Name,
        count: myCount
      }
    })
  } else {
    newTarget = [
      {
        targetId: '0',
        Name: 'children under five',
        count: 0
      }
    ]
  }

  console.log(newTarget)
  emits('update:TargetMember', newTarget)
}

const rowsDri = computed<QTableProps['rows']>(() => {
  return calk.getNutritionDemand(props.targetMembers, props.driItems)
})

const columnsDri: QTableProps['columns'] = [
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

const rowsFamilyMember = computed<QTableProps['rows']>(() => {
  return props.driItems.map((item) => {
    // targetで人数が設定されている場合はそれを利用、それ以外は0を設定
    const res = props.targetMembers.find((sameId: TargetMember) => sameId.targetId === item.id)
    console.log(props.targetMembers)
    console.log(res)

    return {
      targetId: item.id,
      Name: item.Name,
      count: res ? res.count : 0
    }
  })
})

const columnsFamilyMember: QTableProps['columns'] = [
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
    :rows="rowsFamilyMember"
    :columns="columnsFamilyMember"
    row-key="name"
  >
    <template v-slot:body="familyTableRow">
      <q-tr :props="familyTableRow">
        <q-td key="item" :props="familyTableRow"> {{ familyTableRow.row.Name }} </q-td>
        <q-td key="val" :props="familyTableRow">
          <q-input
            v-model="familyTableRow.row.count"
            type="number"
            @update:model-value="
              (newValue) => updateTarget(familyTableRow.row.targetId, Number(newValue))
            "
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
    :rows="rowsDri"
    :columns="columnsDri"
    row-key="name"
  />
</template>
