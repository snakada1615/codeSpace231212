<script setup lang="ts">
import { useProjectData } from '@/stores/mainStore'
const projectData = useProjectData()
</script>
<template>
  <q-tabs align="left" class="bg-teal-3 text-black">
    <q-route-tab to="/" label="home" />
    <q-route-tab to="/setUserInfo" label="user info" v-if="projectData.stateUserId === true" />
    <q-route-tab
      to="/setProjectInfo"
      label="Project info"
      v-if="projectData.stateUserInfo === true"
    />
    <q-route-tab to="/myTest01" label="myTest01" />
  </q-tabs>
</template>
