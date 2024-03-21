<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue'
import setFamilyInfo from '@/components/molecules/setFamilyInfo.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/myTypes'
import { ref } from 'vue'
import { JsonTreeView } from 'json-tree-view-vue3'
import FakerFunc from '@/models/fakerFunc'

const myProjectData = useProjectData()

// interface housesInfoType extends Array<houseInfoType> {}
// housesの情報をリストに変換(ユーザーがhousesから編集対象のhouseを選択するため)
const housesInfo = computed(() => {
  if (!myProjectData.house) {
    return []
  }
  return myProjectData.house.map((item, index) => {
    return {
      label: item.familyName,
      value: index
    }
  })
})

// houseの情報を編集するためのcomputed props
const currentHouse: WritableComputedRef<myVal.House | null> = computed({
  get(): myVal.House | null {
    if (!myProjectData.house) {
      return null
    } else {
      return myProjectData.house[selectedHouse.value.value]
    }
  },
  set(val: myVal.House | null) {
    if (!val || !myProjectData.house) {
      return
    } else {
      myProjectData.updateStateValue(
        'house',
        myProjectData.house.map((item) => {
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

// houseの値を更新
function changeCurrentHouse(val: typeof selectedHouse) {
  const res = val.value.value > 0 ? currentHouse.value?.house : null
  if (!res) {
    return
  }
  const current = myProjectData.currentDataSet
  myProjectData.updateStateValue('currentDataSet', {
    ...current,
    house: res
  })
}

// 新規追加
function addNewHouse() {
  const res: myVal.House = {
    ...myVal.houseDefault,
    user: myProjectData.user.user,
    projectInfo: myProjectData.projectInfo.projectInfo,
    locationId: newLocation.value,
    house: FakerFunc.uuid(),
    familyName: newFamilyName.value
  }
  console.log(myVal.houseDefault)
  console.log(res)
  let resArray = myProjectData.house ? [...myProjectData.house] : []
  resArray.push(res)
  myProjectData.updateStateValue('house', resArray)
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
      @update:model-value="changeCurrentHouse"
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
    {{ currentHouse }}
    <JsonTreeView :json="JSON.stringify(myProjectData.house)" :maxDepth="4" />
  </q-card>
</template>
