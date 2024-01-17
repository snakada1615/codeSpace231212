<script setup lang="ts">
import { computed } from 'vue'
import projectData from '../components/molecules/ProjectData.vue'

import { useProjectData } from '../stores/mainStore'
const myProjectData = useProjectData()

const projectInfoStore = computed({
  get() {
    return myProjectData.projectInfo
  },
  set(val) {
    myProjectData.setProjectInfo(val)
  }
})
</script>
<template>
  {{ myProjectData.projectInfo }}
  <projectData v-model:projectInfo="projectInfoStore" />
</template>
