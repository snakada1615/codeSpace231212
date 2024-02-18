<template>
  <div class="q-pa-md">
    {{ projectStore.appUser }}
    <div class="row">
      <div class="col">
        <q-file
          outlined
          v-model="uploadedFile"
          label="Load CSV file"
          filled
          dense
          accept=".csv"
          @update:model-value="processFile"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <div class="col-3">
        <q-select
          :options="refKeys"
          v-model:model-value="refKey"
          label="fileType"
          dense
          filled
        ></q-select>
      </div>
      <div class="col-3">
        <q-btn label="save" icon="save" :disable="!isDataReady" @click="saveCsv" class="q-mx-sm" />
      </div>
    </div>
    <q-card v-if="!isFiletypeCorrect" class="text-negative q-pa-sm">
      your csv-file must contain: {{ refKey.value }}
    </q-card>
    <q-card v-if="isFiletypeCorrect && !isDataReady" class="text-negative q-pa-sm">
      error in data type from csv: {{ refKey.value }}
    </q-card>
    <q-card v-if="isDataReady" class="text-primary q-pa-sm">
      now you can save/register this csv-file under your account!
    </q-card>
    <q-table :rows="csvArray"></q-table>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, computed } from 'vue'
import Papa from 'papaparse'
import * as myVal from '../../models/myTypes'
import myFunc from '../../models/MyFunctions'
import { useProjectData } from '../../stores/mainStore'
const projectStore = useProjectData()
import fakerFunc from '../../models/fakerFunc'
import { Dialog } from 'quasar'

const isFiletypeCorrect = ref(false)

const isDataReady = computed(() => {
  return isFiletypeCorrect.value && typedCsv
})

let typedCsv = ref<myVal.FctItems | myVal.DriItems | null>(null)

// Define an interface that matches the structure of a row in your CSV
interface CsvRow {
  [key: string]: string // This assumes all values in the CSV are strings
}

// 読み込んだCSVファイル全体の生データを入れる変数（Array of Object）
let csvArray: Ref<CsvRow[]> = ref([]) // Example initialization

// 読み込んだCSVファイルの型チェックを行うためのkey一覧。q-selectのv-modelにつなげてドロップダウンで選択（DRI/FCT）
let csvKeys = computed(() => {
  return Object.keys(csvArray.value[0])
})

// ドロップダウン用のオプション（FCT/DRI）。const refKey = Object.keys(myVal.driItemDefault)
const refKeys = [
  { label: 'FCT', value: Object.keys(myVal.fctItemDefault), myType: typeof myVal.fctItemDefault },
  { label: 'DRI', value: Object.keys(myVal.driItemDefault), myType: typeof myVal.driItemDefault }
]
// ドロップダウン用のv-model
const refKey = ref(refKeys[0])

// CSVファイルの型チェック
function typeCheck(refArray: string[]) {
  let res = true
  refArray.forEach((item) => {
    if (!csvKeys.value.includes(item)) {
      res = false
    }
  })
  return res
}

// Define a ref to store the selected file
const uploadedFile = ref<File | null>(null)

function saveCsv(): void {
  if (refKey.value.label === 'DRI') {
    // driの更新
    const myId = fakerFunc.uuid()
    projectStore.setDri(typedCsv.value as myVal.DriItems)
    projectStore.fireSetDri(myId, {
      note: '',
      userId: projectStore.appUser.userId,
      data: typedCsv.value as myVal.DriItems,
      driId: myId
    })

    // currentDataSetの更新
    const currentData: myVal.CurrentDataSet = {
      ...projectStore.currentDataSet,
      dri: myId
    }
    projectStore.setCurrentDataset(currentData)
    projectStore.fireSetCurrentDataSet(projectStore.appUser.userId, currentData)
  } else {
    // fctの更新
    const myId = fakerFunc.uuid()
    projectStore.setFct(typedCsv.value as myVal.FctItems)
    projectStore.fireSetFct(myId, {
      note: '',
      userId: projectStore.appUser.userId,
      data: typedCsv.value as myVal.FctItems,
      fctId: myId
    })

    // currentDataSetの更新
    const currentData: myVal.CurrentDataSet = {
      ...projectStore.currentDataSet,
      fct: myId
    }
    projectStore.setCurrentDataset(currentData)
    projectStore.fireSetCurrentDataSet(projectStore.appUser.userId, currentData)
  }
}

const processFile = (): void => {
  if (!uploadedFile.value) return

  // Create a FileReader instance
  const reader = new FileReader()

  // Define what happens when the file has been read
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const content = e.target?.result
    if (typeof content !== 'string') return

    // Parse CSV content
    Papa.parse(content, {
      header: true,
      complete: (results) => {
        // Handle the CSV data as needed...
        csvArray.value = results.data as CsvRow[]

        // ファイルの型チェック
        isFiletypeCorrect.value = typeCheck(refKey.value.value)
        if (!isFiletypeCorrect.value) {
          Dialog.create({
            message:
              'data type is invalid for DRI type. it must include columns [ ' +
              refKey.value.value +
              ']'
          })
          return
        }

        typedCsv.value = myFunc.convertToTypedArray<myVal.DriItem>(csvArray.value)
      },
      error: (error: Error) => {
        isFiletypeCorrect.value = false
        console.error('Error parsing CSV:', error)
      }
    })
  }

  // Read the uploaded file as text
  reader.readAsText(uploadedFile.value)
}
</script>
