<script setup lang="ts">
import type { PropType } from 'vue'
import { type DiversityStates } from 'src/models/MyInterface'

defineProps({
  diversityStates: {
    type: Object as PropType<DiversityStates>,
    required: true
  }
})
const setBgColor = (val: boolean): string => {
  return val ? 'bg-blue-4' : 'bg-red-4'
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
            v-for="diversityState in diversityStates"
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
