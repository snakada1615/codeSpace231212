<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <q-card>
      <q-icon name="flag" />
      <div>halo/ {{ projectData.modifiedStates }}</div>
      <q-btn label="データ初期化" @click="onClick" />
      <q-btn label="notify" @click="$q.notify({ message: 'はろー', position: 'top-right' })" />
      <q-btn
        label="notify"
        @click="$q.notify({ message: 'ぼろー', position: 'top-right', color: 'teal' })"
      />
      <JsonTreeView :json="JSON.stringify(projectData)" :maxDepth="4" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useProjectData } from '../stores/mainStore'
import { JsonTreeView } from 'json-tree-view-vue3'
import 'json-tree-view-vue3/dist/style.css'
const projectData = useProjectData()
function onClick() {
  projectData.fireResetData(projectData.appUser.user)
}
</script>
