<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue'
import setFamilyInfo from '@/components/molecules/setFamilyInfo.vue'
import { useProjectData } from '../stores/mainStore'
import * as myVal from '../models/myTypes'
import { ref } from 'vue'

const myProjectData = useProjectData()

// interface housesInfoType extends Array<houseInfoType> {}
const housesInfo = computed(() => {
  return myProjectData.houses.map((item, index) => {
    return {
      label: item.familyName,
      value: index
    }
  })
})

const currentHouse: WritableComputedRef<myVal.House> = computed({
  get() {
    return myProjectData.houses[selectedHouse.value.value]
  },
  set(val: myVal.House) {
    myProjectData.setHouses(
      myProjectData.houses.map((item) => {
        if (val.familyId === item.familyId) {
          return val
        }
        return item
      })
    )
  }
})
console.log(housesInfo)

const selectedHouse = ref({ lebel: '', value: 0 })
</script>
<template>
  <q-select :options="housesInfo" v-model="selectedHouse" />
  <setFamilyInfo :disabled="myProjectData.houses.length === 0" v-model:house="currentHouse" />
</template>
