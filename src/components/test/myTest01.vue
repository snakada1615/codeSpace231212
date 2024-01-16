<script setup lang="ts">
import UserInfo from '@/components/atoms/UserInfo.vue'
import { ref } from 'vue'
import * as myVal from '@/models/MyInterface'

function newError() {
  throw new Error('i am new error')
}
import useCounterStore from '@/stores/counter'
const counterStore = useCounterStore()

const myAppUser = ref(myVal.appUserDefault)
</script>

<template>
  <div>let's enjoy</div>
  <q-btn label="push me!" @click="newError"></q-btn>
  <p>Count: {{ counterStore.count }}</p>
  <p>Doubled Count: {{ counterStore.doubleCount }}</p>
  <button @click="counterStore.countUp()">Count up!</button>
  <UserInfo :app-user="myAppUser" />
</template>
