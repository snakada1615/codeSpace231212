<script setup lang="ts">
import loginDialog from '@/components/atoms/LoginDialog.vue'
import { ref } from 'vue'

function newError() {
  throw new Error('i am new error')
}
import useCounterStore from '@/stores/counter'
const counterStore = useCounterStore()
const dlgFlag = ref(false)
</script>

<template>
  <div>let's enjoy</div>
  <q-btn label="push me!" @click="newError"></q-btn>
  <p>Count: {{ counterStore.count }}</p>
  <p>Doubled Count: {{ counterStore.doubleCount }}</p>
  <button @click="counterStore.countUp()">Count up!</button>
  <q-btn icon="mood" dense class="q-mx-md" @click="dlgFlag = true" />
  <loginDialog v-model:open-dialog="dlgFlag" />
</template>
