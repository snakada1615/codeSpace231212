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
    <q-table :rows="res"></q-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Papa from 'papaparse'
let res = ref([])

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
        res.value = results.data
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
