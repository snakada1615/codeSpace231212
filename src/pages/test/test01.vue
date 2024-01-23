<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import * as myVal from '../../models/MyInterface'
import { fireFunc } from '../../models/fireFunctions'
import { computed, ref, type PropType } from 'vue'

interface DatType {
  firestName: string
  lastName: string
  character: {
    hobby: string
    movie: {
      top: string
      '2nd': string
    }
  }
}

interface DatTypeArray extends Array<DatType> {}

const data01 = ref<DatTypeArray>([
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

function saveDat() {
  fireFunc.fireSetTyped<DatTypeArray>('test', 'setMerge', data01.value)
}

function modifyDat() {
  data01.value[1].character.movie['2nd'] = 'ハゲ親父'
  fireFunc.fireSetMergeTyped<DatTypeArray>('test', 'setMerge', data01.value)
}
</script>
<template>
  <q-card>
    <div>halo</div>
    <div>{{ data01 }}</div>
  </q-card>
  <q-btn label="here" @click="saveDat" />
  <q-btn label="there" @click="modifyDat" />
</template>
