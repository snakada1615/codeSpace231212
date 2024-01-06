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

const emits = defineEmits<{
  (e: 'update:Star', value: boolean): void
  (e: 'update:menuName', value: string): void
}>()

const onChangeStar = (value: boolean): void => {
  emits('update:Star', value)
}

const stringOptions = myVal.commonMenus
const menuName = ref(null)
const menuNames = ref(stringOptions)

const menuItemComputed = computed(() => {
  return props.menuItem
})

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

// メニュー名の変更をemit
function updateMenuName(value: string) {
  console.log(value)
  emits('update:menuName', value)
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
        <div class="col">{{ menuItemComputed.label }}</div>
        <div class="col">{{ menuItemComputed.value }}</div>
        <div class="col">
          <q-select
            filled
            dense
            :model-value="menuItemComputed.MenuName"
            use-input
            use-chips
            @new-value="addNewMenuName"
            :options="menuNames"
            @filter="filterMenu"
            @update:model-value="updateMenuName"
          />
        </div>
        <div class="col">{{ menuItemComputed.Weight }}</div>
      </div>
      <div class="row">
        <q-checkbox
          dense
          size="sm"
          :model-value="menuItemComputed.Star"
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
