<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'
import myFunc from 'src/models/MyFunctions'
// 全てのintefaceを読み込む
import * as myVal from 'src/models/MyInterface'

const props = defineProps({
  familyMembers: {
    type: Object as PropType<myVal.FamilyMembers>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:familyMember', value: myVal.FamilyMembers): void
}>()

const updateTarget = (index: string, val: number): void => {
  // targetの変更内容を親コンポーネントにemit
  let newTarget: myVal.FamilyMembers
  newTarget = rowsFamilyMember.value.map((item) => {
    if (index === item.DriId) {
      item.count = val
    }
    return item
  })
  emits('update:familyMember', newTarget)
}

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

const rowsFamilyMember = computed<myVal.FamilyMembers>(() => {
  return props.familyMembers
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

const nutrientSum = computed(() => {
  const digitIndex = {
    En: { label: 'Energy', index: 0 },
    Pr: { label: 'Protein', index: 1 },
    Va: { label: 'Vit-A', index: 2 },
    Fe: { label: 'Iron', index: 3 }
  }
  const res = props.familyMembers.reduce(
    (sum, current) => {
      sum.En += current.En * current.count
      sum.Pr += current.Pr * current.count
      sum.Va += current.Va * current.count
      sum.Pr += current.Pr * current.count
      return sum
    },
    {
      En: 0,
      Pr: 0,
      Va: 0,
      Fe: 0
    }
  )
  return Object.entries(res).map(([key, val]) => {
    // Object[key]でアクセスするための操作
    if (Object.prototype.hasOwnProperty.call(res, key)) {
      const keyTyped = key as keyof typeof res
      const val2 = res[keyTyped]
      const digiIndexVal = digitIndex[keyTyped]
      return {
        key: key,
        value: myFunc.setDigit(val2, digiIndexVal.index),
        label: digiIndexVal.label
      }
    }
  })
})
</script>

<template>
  <!-- FamilyMemberの構成決定 -->
  <q-card class="bg-grey-2 q-pa-sm">
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
              v-model.number="familyTableRow.row.count"
              type="number"
              class="q-py-xs"
              dense
              @update:model-value="
                (newValue) => updateTarget(familyTableRow.row.DriId, Number(newValue))
              "
              :rules="[(val) => typeof val === 'number' || 'only number is allowed']"
              style="max-height: 40px"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- 家族合計での栄養必要量 -->
    <q-table
      class="my-sticky-header-table"
      :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
      flat
      bordered
      dense
      :rows="nutrientSum"
      :columns="columnsDri"
      row-key="name"
    />
    <div class="q-ml-md">KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie</div>
  </q-card>
</template>
