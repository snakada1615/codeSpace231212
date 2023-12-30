<template>
  <button @click="handleClick">Click me!</button>
</template>

<script setup lang="ts">
// Define the emits
const emit = defineEmits<{
  (e: 'button:click'): void
}>()

// Method to handle click events
function handleClick(): void {
  emit('button:click') // Emit the "button:click" event
}
</script>
