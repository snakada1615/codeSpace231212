<script setup lang="ts">
// import * as myVal from '../models/MyInterface'
import { computed } from 'vue'
import userInfo from '../components/atoms/UserInfo.vue'
import { useProjectData } from '../stores/mainStore'
const projectData = useProjectData()

const appUserStore = computed({
  get() {
    return projectData.appUser
  },
  set(val) {
    console.log('set')
    projectData.setAppUser([val])
  }
})
</script>

<template>
  <div>
    <q-card v-if="appUserStore.userId">
      <userInfo v-model:app-user="appUserStore" />
    </q-card>
    <p v-else>you don't have userId. please start from login again</p>
  </div>
</template>
