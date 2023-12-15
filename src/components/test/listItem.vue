<script setup lang="ts">
import { PropType } from 'vue'

interface diversityState {
  name: string
  status: boolean
}

defineProps({
  diversityStatus: {
    type: Array as PropType<diversityState[]>,
    default: () => []
  }
})
const setBgColor = (val: boolean) => {
  return val ? 'bg-red-4' : 'bg-blue-4'
}
</script>

<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-card bordered>
      <q-card-section class="q-mb-xs bg-green-4">
        <div class="text-h6 q-py-xs">Dietary diversity</div>
      </q-card-section>
      <q-card-section class="q-mt-xs">
        <q-list bordered separator dense class="rounded">
          <q-item
            clickable
            v-ripple
            v-for="diversityState in diversityStatus"
            :key="diversityState.name"
            :class="setBgColor(diversityState.status)"
          >
            <q-item-section>{{ diversityState.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>
