<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { computed, type ComputedRef, type PropType, ref } from 'vue'
import type { QTableProps } from 'quasar'

const props = defineProps({
  fct: {
    type: Object as PropType<myVal.FctItem>,
    required: true
  },
  fctAddOptions: {
    type: Object as PropType<myVal.FctAddOptions>,
    required: true
  },
  star: {
    type: Boolean,
    required: true
  },
  commonMenus: {
    type: Array<string>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:star', value: boolean): void
  (e: 'update:fctAddOptions', value: myVal.FctAddOptions): void
}>()

// menuItem.Star更新
const onChangeStar = (value: boolean): void => {
  emits('update:star', value)
}

// fctRowItemの追加
const onFctAddOptions = (): void => {
  emits('update:fctAddOptions', fctAddOptionsRef.value)

  //fctAddOptionsRefを初期化
  fctAddOptionsRef.value = {
    NutrientValue: 0,
    Weight: 0,
    MenuName: ''
  }
}

// メニュー名一覧
const menuNames = ref<typeof myVal.commonMenus>(props.commonMenus)

// リストにないメニュー名を追加する
function addNewMenuName(
  inputValue: string,
  doneFn: (item?: any, mode?: 'toggle' | 'add' | 'add-unique' | undefined) => void
) {
  // Your implementation here.

  if (inputValue.length > 0) {
    if (!menuNames.value.includes(inputValue)) {
      doneFn(inputValue as any, 'toggle') // Cast inputValue to `any` since `doneFn` expects item?: any
    }
  }
}

// メニュー名のフィルタリング
function filterMenu(val: string, update: (cb: () => void) => void) {
  update(() => {
    if (val === '') {
      menuNames.value = props.commonMenus
    } else {
      const needle = val.toLowerCase()
      menuNames.value = props.commonMenus.filter((v) => v.toLowerCase().indexOf(needle) > -1)
    }
  })
}

// fctSelectedItemに追加要素（fctAppOptions）を付与
const fctAddOptionsRef = ref<myVal.FctAddOptions>(props.fctAddOptions)

// table col定義
// 列の定義
const columnsMenuItem: QTableProps['columns'] = [
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

// table 行の定義
const rowsMenuItem: ComputedRef<myVal.FctRowItem> = computed(() => {
  return {
    ...props.fct,
    Star: props.star,
    ...fctAddOptionsRef.value
  }
})

// validationルール
const weightRules = computed(() => {
  const res =
    typeof fctAddOptionsRef.value.Weight === 'number' && Number(fctAddOptionsRef.value.Weight) > 0
  return res
})

const menuRules = computed(() => {
  const res = fctAddOptionsRef.value.MenuName ? true : false
  return res
})

const allRule = computed(() => menuRules.value && weightRules.value)
</script>

<template>
  <q-card class="bg-grey-2 q-pa-sm">
    <q-table
      :table-header-style="{ backgroundColor: 'DarkSeaGreen' }"
      flat
      bordered
      dense
      :rows="[rowsMenuItem]"
      :columns="columnsMenuItem"
    />
    <div class="row bg-grey-4">
      <div class="col-1 text-center">
        <div>add</div>
      </div>
      <div class="col-6 text-center">MenuName</div>
      <div class="col text-center">Weight</div>
      <div class="col text-center">Star</div>
    </div>
    <div class="row flex-center text-center">
      <div class="col-1">
        <q-btn
          round
          ripple
          color="primary"
          icon="add"
          size="sm"
          :disable="!allRule"
          @click="onFctAddOptions"
        />
      </div>
      <div class="col-6">
        <q-select
          dense
          hide-bottom-space
          v-model:model-value="fctAddOptionsRef.MenuName"
          use-input
          use-chips
          @new-value="addNewMenuName"
          :options="menuNames"
          @filter="filterMenu"
          :error="!menuRules"
          error-message="'please set menu name'"
        />
      </div>
      <div class="col">
        <q-input
          type="number"
          debounce="500"
          dense
          v-model.number="fctAddOptionsRef.Weight"
          error-message="only number is allowed"
          :error="!weightRules"
        ></q-input>
      </div>
      <div class="col">
        <q-checkbox
          dense
          size="sm"
          :model-value="props.star"
          label="mark as favorite"
          color="teal"
          class="q-mt-md q-ml-md justify-center"
          checked-icon="star"
          unchecked-icon="star_border"
          indeterminate-icon="help"
          @update:model-value="onChangeStar"
        />
      </div>
    </div>
  </q-card>
</template>
