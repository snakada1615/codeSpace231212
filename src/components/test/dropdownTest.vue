<template>
  <div class="q-pa-md">
    <q-select
      filled
      dense
      v-model="menuName"
      use-input
      use-chips
      @new-value="addNewMenuName"
      :options="menuNames"
      @filter="filterMenu"
      @update:model-value="updateMenuName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as myVal from 'src/models/myTypes'

const stringOptions = myVal.commonMenus
const menuName = ref(null)
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

// メニュー名の変更をemit
function updateMenuName(value: string) {
  console.log(value)
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
