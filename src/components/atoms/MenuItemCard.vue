<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { computed, type PropType, ref } from 'vue'

const props = defineProps({
  menuItem: {
    type: Object as PropType<myVal.MenuItem>,
    required: true
  },
  commonMenus: {
    type: Object,
    required: true
  }
})

// emit設定
const emits = defineEmits<{
  (e: 'update:menuItem', value: typeof props.menuItem): void
}>()

// menuItem.Star更新
const onChangeStar = (value: boolean): void => {
  const res: myVal.MenuItem = {
    keyFct: props.menuItem.keyFct,
    NutritionValue: 52,
    FctName: props.menuItem.FctName,
    FoodGroup: props.menuItem.FoodGroup,
    Weight: props.menuItem.Weight,
    MenuName: props.menuItem.MenuName,
    Star: value
  }
  emits('update:menuItem', res)
}

// menuItem.MenuNameの更新
const updateMenuName = (value: string): void => {
  const res: myVal.MenuItem = {
    keyFct: props.menuItem.keyFct,
    NutritionValue: 52,
    FctName: props.menuItem.FctName,
    FoodGroup: props.menuItem.FoodGroup,
    Weight: props.menuItem.Weight,
    MenuName: value,
    Star: props.menuItem.Star
  }
  emits('update:menuItem', res)
}

// menuItem.Weight の更新
const updateWeight = (value: string | number | null): void => {
  const numericValue = Number(value)
  if (isNaN(numericValue)) {
    return
  }
  const res: myVal.MenuItem = {
    keyFct: props.menuItem.keyFct,
    NutritionValue: 52,
    FctName: props.menuItem.FctName,
    FoodGroup: props.menuItem.FoodGroup,
    Weight: numericValue,
    MenuName: props.menuItem.MenuName,
    Star: props.menuItem.Star
  }

  emits('update:menuItem', res)
}

const stringOptions = myVal.commonMenus
const menuNames = ref(stringOptions)

// リストにないメニュー名を追加する
function addNewMenuName(
  inputValue: string,
  doneFn: (item?: any, mode?: 'toggle' | 'add' | 'add-unique' | undefined) => void
) {
  // Your implementation here.

  if (inputValue.length > 0) {
    if (!stringOptions.includes(inputValue)) {
      doneFn(inputValue as any, 'toggle') // Cast inputValue to `any` since `doneFn` expects item?: any
    }
  }
}

// メニュー名のフィルタリング
function filterMenu(val: string, update: (cb: () => void) => void) {
  update(() => {
    if (val === '') {
      menuNames.value = stringOptions
    } else {
      const needle = val.toLowerCase()
      menuNames.value = stringOptions.filter((v) => v.toLowerCase().indexOf(needle) > -1)
    }
  })
}
</script>

<template>
  <q-card class="bg-grey-2 q-pa-sm">
    <q-card class="bg-grey-4 q-pa-sm q-my-md">
      <div class="row">
        <div class="col">Commodity</div>
        <div class="col">Nutrient value</div>
        <div class="col">Food name</div>
        <div class="col">Weight</div>
      </div>
      <div class="row">
        <div class="col">{{ props.menuItem.FctName }}</div>
        <div class="col">{{ props.menuItem.NutritionValue }}</div>
        <div class="col">
          <q-select
            filled
            dense
            :model-value="props.menuItem.MenuName"
            use-input
            use-chips
            @new-value="addNewMenuName"
            :options="menuNames"
            @filter="filterMenu"
            @update:model-value="updateMenuName"
          />
        </div>
        <div class="col">
          <q-input
            type="number"
            dense
            filled
            :model-value="props.menuItem.Weight"
            :rules="[(val) => typeof val === 'number' || 'only number is allowed']"
            @update:model-value="updateWeight"
          ></q-input>
        </div>
      </div>
      <div class="row">
        <q-checkbox
          dense
          size="sm"
          :model-value="props.menuItem.Star"
          label="mark as favorite"
          color="teal"
          class="q-mt-md q-ml-md"
          checked-icon="star"
          unchecked-icon="star_border"
          indeterminate-icon="help"
          @update:model-value="onChangeStar"
        />
      </div>
    </q-card>
  </q-card>
</template>
