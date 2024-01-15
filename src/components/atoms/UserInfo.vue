<template>
  <q-form class="q-gutter-md">
    <q-input filled dense v-model="projectInfo.projectName" label="Project Name" class="q-mx-sm" />
    <q-input filled dense v-model="projectInfo.location" label="Location" />
    <!-- You can add more inputs for other DriItems properties here -->
    <DriSelect v-model:family-members="projectInfo.familyMembers" />
    <q-btn label="Submit" color="primary" @click="submitForm" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QForm, QInput, QBtn } from 'quasar'
import type { ProjectInfo } from '@/models/MyInterface' // Assuming your interface is in a separate file named interfaces.ts
import DriSelect from './DriSelect.vue'
import * as myVal from '@/models/MyInterface'

// Initial state for our form

const projectInfo = ref(myVal.ProjectInfoDefault)

const emits = defineEmits<{
  (e: 'update:projectInfo', value: myVal.ProjectInfo): void
}>()

function submitForm() {
  console.log('Submitted project info:', projectInfo.value)
  // emits('update:projectInfo', projectInfo.value)
  // Handle the form submission logic here
  // e.g., send data to an API, validation, etc.
}
</script>
