<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  familyMembers: {
    type: String as PropType<string>,
    required: true
  }
})
</script>

<template>
  <div>halo</div>
  <div>{{ props.familyMembers }}</div>
</template>
