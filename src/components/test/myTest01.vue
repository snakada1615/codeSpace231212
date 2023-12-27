<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  targetMembers: {
    type: String as PropType<string>,
    required: true
  }
})
</script>

<template>
  <div>halo</div>
  <div>{{ props.targetMembers }}</div>
</template>
