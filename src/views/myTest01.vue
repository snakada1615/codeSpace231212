<script setup lang="ts">
function newError() {
  throw new Error('i am new error')
}
</script>

<template>
  <div>let's enjoy</div>
  <q-btn label="push me!" @click="newError"></q-btn>
</template>
