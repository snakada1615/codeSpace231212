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
import * as myVal from '../../models/MyInterface'
import myFunc from '../../models/MyFunctions'
import { useProjectData } from '../../stores/mainStore'
const projectStore = useProjectData()
import fakerFunc from '../../models/fakerFunc'

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
      users: [projectStore.appUser.userId],
      data: typedCsv.value as myVal.DriItems
    })

    // appUserの更新
    const newAppUser: myVal.AppUser = {
      ...projectStore.appUser,
      currentDataSet: {
        ...projectStore.appUser.currentDataSet,
        dri: myId
      }
    }
    projectStore.setAppUser(newAppUser)
    projectStore.fireSetAppUser(projectStore.appUser.userId, newAppUser)
  } else {
    // fctの更新
    const myId = fakerFunc.uuid()
    projectStore.setDri(typedCsv.value as myVal.FctItems)
    projectStore.fireSetFct(myId, {
      note: '',
      users: [projectStore.appUser.userId],
      data: typedCsv.value as myVal.FctItems
    })

    // appUserの更新
    const newAppUser: myVal.AppUser = {
      ...projectStore.appUser,
      currentDataSet: {
        ...projectStore.appUser.currentDataSet,
        fct: myId
      }
    }
    projectStore.setAppUser(newAppUser)
    projectStore.fireSetAppUser(projectStore.appUser.userId, newAppUser)
  }
}

// // Define a type for the handler functions in the project store
// type SetItemFunction<T> = (item: T) => void;
// type FireSetItemFunction<T> = (id: string, item: T) => void;

// // Define a generic type for AppUser that can accommodate various data set types
// interface AppUserGeneric<T> {
//   userId: string;
//   currentDataSet: {
//     dri?: string; // Assuming 'dri' is just one possible data set key
//     [key: string]: any; // Other data set keys with unknown property names
//   };
// }

// interface SaveCsvParams<T> {
//   typedCsvValue: T;               // The actual CSV value parsed with the correct type
//   setItem: SetItemFunction<T>;    // Function to set the item in the store
//   fireSetItem: FireSetItemFunction<T>; // Function to trigger/fire the set item action
//   dataTypeKey: keyof AppUserGeneric<T>; // The key under which to store the ID in the currentDataSet object
// }

// const saveCsv2 = <T>(params: SaveCsvParams<T>): void => {
//   const { typedCsvValue, setItem, fireSetItem, dataTypeKey } = params;

//   // Generate a unique ID for the new data set entry
//   const myId = fakerFunc.uuid();

//   // Update the project store with the new data set
//   setItem(typedCsvValue);
//   fireSetItem(myId, {
//     note: '',
//     users: [projectStore.appUser.userId],
//     data: typedCsvValue,
//   });

//   // Update the appUser with the new data set ID
//   const newAppUser: AppUserGeneric<T> = {
//     ...projectStore.appUser,
//     currentDataSet: {
//       ...projectStore.appUser.currentDataSet,
//       [dataTypeKey]: myId,
//     },
//   };

//   projectStore.setAppUser(newAppUser);
//   projectStore.fireSetAppUser(projectStore.appUser.userId, newAppUser);
// };

// // Usage example for DRIItems
// saveCsv({
//   typedCsvValue: typedCsv.value as myVal.DriItems,
//   setItem: projectStore.setDri,
//   fireSetItem: projectStore.fireSetDri,
//   dataTypeKey: 'dri',
// });

// // Usage example for FCTItems
// saveCsv({
//   typedCsvValue: typedCsv.value as myVal.FCTItems,
//   setItem: projectStore.setFct,
//   fireSetItem: projectStore.fireSetFct,
//   dataTypeKey: 'fct',
// });

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
          alert(
            'data type is invalid for DRI type. it must include columns [ ' +
              refKey.value.value +
              ']'
          )
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
