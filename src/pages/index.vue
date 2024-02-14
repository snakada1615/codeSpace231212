<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <q-icon name="flag" />
    <div>halo</div>
    <div>stateUserId:{{ projectData.stateUserId }}</div>
    <div>stateUserInfo:{{ projectData.stateUserInfo }}</div>
  </div>
</template>

<script setup lang="ts">
import { useProjectData } from '../stores/mainStore'
const projectData = useProjectData()
</script>
