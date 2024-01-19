<template>
  <div class="q-pa-md">
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
        <q-btn label="save" icon="save" :disable="!isFiletypeCorrect" dense class="q-mx-sm" />
      </div>
    </div>
    <q-card v-if="!isFiletypeCorrect" class="text-negative q-pa-sm">
      your csv-file must contain: {{ refKey.value }}
    </q-card>
    <q-card v-if="isFiletypeCorrect" class="text-primary q-pa-sm">
      now you can save this csv-file under your account
    </q-card>
    <q-table :rows="csvArray"></q-table>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, computed } from 'vue'
import Papa from 'papaparse'
import * as myVal from '../../models/MyInterface'

const isFiletypeCorrect = ref(false)

// Define an interface that matches the structure of a row in your CSV
interface CsvRow {
  [key: string]: string // This assumes all values in the CSV are strings
}

// Create a ref for an array of CsvRow objects
let csvArray: Ref<CsvRow[]> = ref([]) // Example initialization

let csvKeys = computed(() => {
  return Object.keys(csvArray.value[0])
})

// const refKey = Object.keys(myVal.driItemDefault)
const refKeys = [
  { label: 'FCT', value: Object.keys(myVal.fctItemDefault) },
  { label: 'DRI', value: Object.keys(myVal.driItemDefault) }
]
const refKey = ref(refKeys[0])

const typeCheck = (refArray: string[]) => {
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
        console.log('Parsed CSV data:', results.data)
        // Handle the CSV data as needed...
        csvArray.value = results.data as CsvRow[]
        isFiletypeCorrect.value = typeCheck(refKey.value.value)
        if (!isFiletypeCorrect.value) {
          alert(
            'data type is invalid for DRI type. it must include columns [ ' +
              refKey.value.value +
              ']'
          )
        }
        console.log(isFiletypeCorrect.value)
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
