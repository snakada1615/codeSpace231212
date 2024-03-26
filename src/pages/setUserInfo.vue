<script setup lang="ts">
// import * as myVal from '../models/myTypes'
import { computed } from 'vue'
import userInfo from '../components/atoms/UserInfo.vue'
import { useProjectData } from '../stores/mainStore'
const projectData = useProjectData()

const userStore = computed({
  get() {
    return projectData.user
  },
  set(val) {
    projectData.updateStateValue('user', val)
  }
})
</script>

<template>
  <div>
    <q-card v-if="userStore.user">
      <userInfo v-model:user="userStore" />
    </q-card>
    <p v-else>you don't have userId. please start from login again</p>
  </div>
</template>
