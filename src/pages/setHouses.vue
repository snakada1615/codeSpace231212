<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue'
import setFamilyInfo from '@/components/molecules/setFamilyInfo.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/myTypes'
import { ref } from 'vue'
import { JsonTreeView } from 'json-tree-view-vue3'
import FakerFunc from '@/models/fakerFunc'

const myApp = useProjectData()

// interface housesInfoType extends Array<houseInfoType> {}
// housesの情報をリストに変換(ユーザーがhousesから編集対象のhouseを選択するため)
const housesInfo = computed(() => {
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

// houseの情報を編集するためのcomputed props
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
      console.warn('hoi (^^)')
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

// ユーザーが現在選択しているhouseの指標
const selectedHouse = ref({
  label: 'select family',
  value: -1
})

// 編集モードと追加モードのフラグ
const addNewFlag = ref(false)

const newFamilyName = ref('')

const newLocation = ref('')

// バリデーション
function isValidValue(
  val: number | string | null,
  key: 'locationId' | 'familyName'
): boolean | string {
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

// バリデーション
const stateLocation = computed(() => {
  if (isValidValue(newLocation.value, 'locationId') === true) {
    return true
  }
  return false
})

// 追加モード/更新モードの切り替え
function modeChange() {
  selectedHouse.value = {
    label: 'select family',
    value: -1
  }
  newLocation.value = ''
  newFamilyName.value = ''
}

// housesの値を更新
// function changeCurrentHouse(val: typeof selectedHouse) {
//   const res = val.value.value > 0 ? currentHouse.value?.house : null
//   if (!res) {
//     return
//   }
//   // const current = myApp.currentDataSet
//   // myApp.updateStateValue('currentDataSet', {
//   //   ...current,
//   //   house: res
//   // })
//   // let resArray = myApp.houses ? [...myApp.houses] : []
//   // resArray.push(res)
//   const resArray = myApp.houses?.map((item) => {
//     if (item.familyName === currentHouse.value?.familyName) {
//       return res
//     }
//     return item
//   })
//   if (!resArray || resArray.length === 0) {
//     return
//   } else {
//     myApp.updateStateValue('houses', resArray)
//   }
// }

// 新規追加
function addNewHouse() {
  const res: myVal.House = {
    ...myVal.houseDefault,
    user: myApp.user.user,
    projectInfo: myApp.projectInfo.projectInfo,
    locationId: newLocation.value,
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
    <q-select
      v-if="!addNewFlag"
      :options="housesInfo"
      v-model="selectedHouse"
      label="current Family"
      style="max-width: 350px"
      filled
    />
    <div v-else>
      <div class="row">
        <div class="col">
          <q-input
            v-model:model-value="newLocation"
            label="new location"
            class="q-px-sm"
            filled
            dense
            :rules="[(v) => isValidValue(v, 'locationId')]"
          >
            <template v-slot:prepend>
              <q-icon name="flag" />
            </template>
          </q-input>
        </div>
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
            :disable="!stateFamilyName || !stateLocation"
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
