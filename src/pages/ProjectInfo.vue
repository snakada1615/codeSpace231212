<script setup lang="ts">
import * as myVal from '@/models/MyInterface'
import { ref, computed, defineProps, type PropType } from 'vue'
import setProjectInfo from '@/components/molecules/setProjectInfo.vue'

const emits = defineEmits<{
  (e: 'update:projectInfo', value: myVal.ProjectInfo): void
  (e: 'saveProjectInfo', value: myVal.ProjectInfo): void
}>()

const projectInfoRef = ref(myVal.ProjectInfoDefault)

function saveProjectInfo(val: myVal.ProjectInfo) {
  emits('saveProjectInfo', val)
}

// const projectInfoComputed = computed({
//   get() {
//     return props.projectInfo
//   },
//   set(val) {
//     emits('update:projectInfo', val)
//   }
// })
</script>
<template>
  <q-card>
    halo
    <setProjectInfo v-model:projectInfo="projectInfoRef" @saveProjectInfo="saveProjectInfo" />
  </q-card>
</template>
