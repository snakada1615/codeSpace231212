<script setup lang="ts">
import * as myVal from '../models/MyInterface'
import { computed, defineProps, defineEmits, type PropType } from 'vue'
import userInfo from '../components/atoms/UserInfo.vue'
import { useProjectData } from '../stores/mainStore'
const projectData = useProjectData()

const appUserStore = computed({
  get() {
    return projectData.appUser
  },
  set(val) {
    console.log('set')
    projectData.setAppUser(val)
  }
})
</script>

<template>
  <q-card>
    <userInfo v-model:app-user="appUserStore" />
  </q-card>
</template>
