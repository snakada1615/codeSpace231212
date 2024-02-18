<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <q-icon name="flag" />
    <div>halo</div>
    <JsonTreeView :json="JSON.stringify(projectData.projectInfo)" :maxDepth="4" />
  </div>
</template>

<script setup lang="ts">
import { useProjectData } from '../stores/mainStore'
import { JsonTreeView } from 'json-tree-view-vue3'
import 'json-tree-view-vue3/dist/style.css'
const projectData = useProjectData()
</script>
