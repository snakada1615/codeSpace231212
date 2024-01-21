<script setup lang="ts">
import { computed, type WritableComputedRef, type PropType } from 'vue'
import projectData from '../components/molecules/ProjectData.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/MyInterface'

const myProjectData = useProjectData()
const props = defineProps({
  projectId: {
    type: Object as PropType<string>,
    required: true
  }
})

const projectInfoStore: WritableComputedRef<myVal.ProjectInfo> = computed({
  get(): myVal.ProjectInfo {
    return myProjectData.projectInfos.find(
      (val) => val.projectId === props.projectId
    ) as myVal.ProjectInfo
  },
  set(val) {
    const updatedProjectInfos = myProjectData.projectInfos.map((item) => {
      if (item.projectId === props.projectId) {
        return { ...item, val }
      }
      return item // Return the original item if no projectId match
    })

    // Assuming setProjectInfos expects an array of ProjectInfos
    myProjectData.setProjectInfos(updatedProjectInfos)
  }
})
</script>
<template>
  <projectData v-model:projectInfo="projectInfoStore" />
</template>
