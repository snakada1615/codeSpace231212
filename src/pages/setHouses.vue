<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue'
import setFamilyInfo from '@/components/molecules/setFamilyInfo.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/myTypes'
import { ref } from 'vue'
import FakerFunc from '@/models/fakerFunc'

const myApp = useProjectData()

// NOTE computed -> housesの情報(リストボックス用)
// 初期値としてnullを受け取り、適正な値を代入して返す。適正な値が入らない限り次の画面には進めない
const housesInfo = computed(() => {
  // houses=nullなら空Arrayを返す
  if (!myApp.houses) {
    return []
  }
  return myApp.houses.map((item, index) => {
    return {
      label: item.familyName,
      value: index
    }
  })
})

// NOTE computed -> houseの情報(selectedHouseが変わるたびにhouseを切り替え、更新時はpinia関数呼び出し)
const currentHouse: WritableComputedRef<myVal.House | null> = computed({
  get(): myVal.House | null {
    if (!myApp.houses) {
      return null
    } else {
      return myApp.houses[selectedHouse.value.value]
    }
  },
  set(val: myVal.House | null) {
    if (!val || !myApp.houses) {
      return
    } else {
      myApp.updateStateValue(
        'houses',
        myApp.houses.map((item) => {
          if (val.house === item.house) {
            return val
          }
          return item
        })
      )
    }
  }
})

// NOTE ref -> ユーザーが現在選択しているhouseのindex
const selectedHouse = ref({
  label: 'select family',
  value: -1
})

// NOTE ref -> 編集モードと追加モードのフラグ
const addNewFlag = ref(false)

// NOTE ref -> 新規追加用の家族名
const newFamilyName = ref('')

// バリデーション
function isValidValue(val: number | string | null, key: 'familyName'): boolean | string {
  const result = myVal.HouseZod.shape[key].safeParse(val)
  if (result.success) {
    if (
      key === 'familyName' &&
      housesInfo.value.map((item) => item.label).includes(String(val) || '')
    ) {
      return 'Please set unique family name'
    }
    return true // Or some validation logic that returns a boolean
  } else {
    // console.error(result.error.errors)
    return result.error.errors.map((e) => e.message).join(', ')
  }
}

// バリデーション
const stateFamilyName = computed(() => {
  if (isValidValue(newFamilyName.value, 'familyName') === true) {
    return true
  }
  return false
})

// NOTE function -> 追加モード/更新モードの切り替え
function modeChange() {
  selectedHouse.value = {
    label: 'select family',
    value: -1
  }
  newFamilyName.value = ''
}

// NOTE function -> 新規追加
function addNewHouse() {
  const res: myVal.House = {
    ...myVal.houseDefault,
    house: FakerFunc.uuid(),
    familyName: newFamilyName.value
  }

  let resArray = myApp.houses ? [...myApp.houses] : []
  resArray.push(res)
  myApp.updateStateValue('houses', resArray)
  addNewFlag.value = false
  selectedHouse.value = {
    label: newFamilyName.value,
    value: housesInfo.value.length - 1
  }
}
</script>

<template>
  <q-card>
    <q-toggle
      v-model="addNewFlag"
      color="green"
      label="Add new family"
      @update:model-value="modeChange"
    />

    <!-- 編集モード -->
    <!-- 編集モード&&myApp.house!==nullの場合のみ表示 -->
    <q-select
      v-if="!addNewFlag && !myApp.houses"
      :options="housesInfo"
      v-model="selectedHouse"
      label="current Family"
      style="max-width: 350px"
      filled
    />

    <!-- 追加モード -->
    <div v-else>
      <div class="row">
        <div class="col">
          <q-input
            v-model:model-value="newFamilyName"
            label="new familyName"
            filled
            dense
            :rules="[(v) => isValidValue(v, 'familyName')]"
          >
            <template v-slot:prepend>
              <q-icon name="face" />
            </template>
          </q-input>
        </div>
        <div class="col">
          <q-btn
            icon="add"
            round
            class="q-ml-md"
            color="green"
            @click="addNewHouse"
            :disable="!stateFamilyName"
          />
        </div>
      </div>
    </div>
    <setFamilyInfo
      v-if="currentHouse && !addNewFlag"
      v-model:house="currentHouse"
      :currentHouseNames="housesInfo.map((item) => item.label)"
    />
  </q-card>
</template>
