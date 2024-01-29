<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue'
import projectData from '../components/molecules/ProjectData.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/MyInterface'

const myProjectData = useProjectData()

const projectInfoStore: WritableComputedRef<myVal.ProjectInfo> = computed({
  get(): myVal.ProjectInfo {
    return myProjectData.projectInfo
  },
  set(val) {
    myProjectData.setProjectInfo(val)
  }
})

console.log(projectInfoStore)
</script>
<template>
  <projectData v-model:projectInfo="projectInfoStore" />
</template>
