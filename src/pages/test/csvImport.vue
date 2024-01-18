<template>
  <div class="q-pa-md">
    <q-file
      outlined
      v-model="uploadedFile"
      label="Choose CSV file"
      filled
      dense
      accept=".csv"
      @update:model-value="processFile"
    >
      <template v-slot:prepend>
        <q-icon name="cloud_upload" />
      </template>
    </q-file>
    <q-table :rows="csvArray"></q-table>
    <div>{{ csvArray[0] }}</div>
    <div>{{ refKeys }}</div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, computed } from 'vue'
import Papa from 'papaparse'
import * as myVal from '../../models/MyInterface'

// Define an interface that matches the structure of a row in your CSV
interface CsvRow {
  [key: string]: string // This assumes all values in the CSV are strings
}

// Create a ref for an array of CsvRow objects
let csvArray: Ref<CsvRow[]> = ref([]) // Example initialization

let csvKeys = computed(() => {
  return Object.keys(csvArray.value[0])
})

const refKeys = Object.keys(myVal.driItemDefault)

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
        const res = typeCheck(refKeys)
        if (!res) {
          alert('data type is invalid for DRI type. it must include columns [ ' + refKeys + ']')
        }
        console.log(res)
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
      }
    })
  }

  // Read the uploaded file as text
  reader.readAsText(uploadedFile.value)
}
</script>
