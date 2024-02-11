<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
// import * as myVal from '../../models/myTypes'
// import fireFunc from '../../models/fakerFunc'
import { ref } from 'vue'
const data01 = ref([
  {
    firestName: 'nanmo',
    lastName: 'naiko',
    character: {
      hobby: 'hirune',
      movie: {
        top: 'home alone',
        '2nd': 'carrie'
      }
    }
  },
  {
    firestName: 'fun',
    lastName: 'popie',
    character: {
      hobby: 'hunt',
      movie: {
        top: 'ben her',
        '2nd': 'school rock'
      }
    }
  }
])
</script>
<template>
  <q-card>
    <div>halo</div>
    <div>{{ data01 }}</div>
  </q-card>
</template>
