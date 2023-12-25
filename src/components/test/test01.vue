<script setup type="ts">
const props=defineProps({
    targetMembers: {
    type: string,
    required: true
  },
})
</script>

<template>
  <div>halo</div>
  <div>{{ props.targetMembers }}</div>
</template>
