<script setup lang="ts">
import type { DriItems, TargetMembers } from 'src/models/MyInterface'
import { computed, type PropType } from 'vue'
import type { QTableProps } from 'quasar'
import myFunc from 'src/models/MyFunctions'
// 全てのintefaceを読み込む
import * as myVal from 'src/models/MyInterface'

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
  (e: 'update:TargetMember', value: TargetMembers): void
}>()

const updateTarget = (index: string, val: number): void => {
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

  emits('update:TargetMember', newTarget)
}

const rowsDri = computed<QTableProps['rows']>(() => {
  return myFunc.getNutritionDemand(props.targetMembers, props.driItems).map((item) => {
    let index: number
    switch (item.label) {
      case 'Energy':
        index = 0
        break
      case 'Protein':
        index = 1
        break
      case 'Vit-A':
        index = 2
        break
      case 'Iron':
        index = 3
        break
      default:
        index = -1
    }
    return {
      key: item.key,
      value: myFunc.setDigit(item.value, index),
      label: item.label
    }
  })
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
  // targetMembersとdriItemsの行数が異なる場合にエラー
  const targetMembersId = myFunc
    .uniq(
      props.targetMembers.map((item) => {
        return item.targetId
      })
    )
    .sort()
    .toString()
  const driItemsId = myFunc
    .uniq(
      props.driItems.map((item) => {
        return item.DriId
      })
    )
    .sort()
    .toString()
  if (targetMembersId !== driItemsId) {
    console.log(targetMembersId)
    console.log(driItemsId)
    throw new Error('targetMembers does not match with familyType in driItems')
  }

  // 上記で問題なければ以下を返す
  return props.targetMembers.map((item) => {
    return {
      targetId: item.targetId,
      Name: item.Name,
      count: item.count
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
  <!-- TargetMemberの構成決定 -->
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
              v-model="familyTableRow.row.count"
              type="number"
              class="q-py-xs"
              dense
              @update:model-value="
                (newValue) => updateTarget(familyTableRow.row.targetId, Number(newValue))
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
      :rows="rowsDri"
      :columns="columnsDri"
      row-key="name"
    />
    <div class="q-ml-md">KC: KiloCalorie, MC: MegaCalorie, GC: GigaCalorie</div>
  </q-card>
</template>
