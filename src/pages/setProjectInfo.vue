<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue'
import projectData from '../components/molecules/ProjectData.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/MyInterface'
import fakerFunc from '../models/fakerFunc'

const myProjectData = useProjectData()
const userId = myProjectData.appUser.userId

const projectInfoStore: WritableComputedRef<myVal.ProjectInfo> = computed({
  get(): myVal.ProjectInfo {
    let res = myProjectData.projectInfos.find(
      (val) => val.projectId === userId
    ) as myVal.ProjectInfo

    // プロジェクトデータが存在しない場合は初期値を返す
    if (!res) {
      res = { ...myVal.projectInfoDefault, userId: userId, projectId: fakerFunc.uuid() }
    }
    return res
  },
  set(val) {
    const updatedProjectInfos = myProjectData.projectInfos.map((item) => {
      if (item.projectId === val.projectId) {
        return { ...item, val }
      }
      return item // Return the original item if no projectId match
    })

    // Assuming setProjectInfos expects an array of ProjectInfos
    myProjectData.setProjectInfos(updatedProjectInfos)
  }
})

console.log(projectInfoStore)
</script>
<template>
  <projectData v-model:projectInfo="projectInfoStore" />
</template>
