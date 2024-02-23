<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <q-card>
      <q-icon name="flag" />
      <div>halo</div>
      <q-btn label="push me" />
      <JsonTreeView :json="JSON.stringify(myVal.appUserDefault)" :maxDepth="4" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useProjectData } from '../stores/mainStore'
import { JsonTreeView } from 'json-tree-view-vue3'
import 'json-tree-view-vue3/dist/style.css'
import { fireFunc } from '@/models/fireFunctions'
import * as myVal from '@/models/myTypes'
const projectData = useProjectData()
</script>
