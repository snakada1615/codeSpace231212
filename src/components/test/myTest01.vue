<script setup lang="ts">
import UserInfo from '@/components/atoms/UserInfo.vue'
import { ref } from 'vue'

function newError() {
  throw new Error('i am new error')
}
import useCounterStore from '@/stores/counter'
const counterStore = useCounterStore()
</script>

<template>
  <div>let's enjoy</div>
  <q-btn label="push me!" @click="newError"></q-btn>
  <p>Count: {{ counterStore.count }}</p>
  <p>Doubled Count: {{ counterStore.doubleCount }}</p>
  <button @click="counterStore.countUp()">Count up!</button>
  <UserInfo />
</template>
