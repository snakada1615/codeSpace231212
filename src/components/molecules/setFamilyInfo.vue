<script lang="ts" setup>
import * as myVal from '@/models/myTypes'
import { computed, type PropType } from 'vue'
import DriSelect from '../atoms/DriSelect.vue'

const props = defineProps({
  house: {
    type: Object as PropType<myVal.House | myVal.HouseBlank>,
    required: true
  },
  currentHouseNames: {
    type: Object as PropType<String[]>,
    required: true
  }
})

const houseComputed = computed(() => {
  if (!props.house) {
    return myVal.houseDefault
  } else {
    return props.house
  }
})

const emits = defineEmits<{
  (e: 'update:house', value: myVal.House): void
}>()

function updateHouse<K extends keyof myVal.House>(value: myVal.House[K], fieldName: K) {
  // Clone the current houseComputed.value
  let res = { ...houseComputed.value }

  res[fieldName] = value

  // Emit the updated house object
  emits('update:house', res)
}

// function updateHouse(val: string | number | null, elemId: typeof elemIdKey) {
//   // Clone the current houseComputed.value
//   let res: HouseIndexed = { ...houseComputed.value }

//   // Assign the new value to the field represented by elemId if it exists.
//   if (Object.keys(res).includes(elemId)) {
//     res[elemId] = (typeof val === 'number' ? val.toString() : val) || ''
//   }

//   // Emit the updated house object
//   emits('update:house', res)
// }

function countWord(parent: String[], child: string) {
  let count = 0
  parent.map((item) => {
    if (item.toLowerCase() === child.toLowerCase()) {
      count++
    }
  })
  return count
}

function isValidValue(val: number | string | null, key: 'familyName'): boolean | string {
  const result = myVal.HouseZod.shape[key].safeParse(val)
  if (result.success) {
    if (key === 'familyName' && countWord(props.currentHouseNames, String(val) || '') > 1) {
      return 'Please set unique family name'
    }
    return true // Or some validation logic that returns a boolean
  } else {
    // console.log(result.error.errors)
    return result.error.errors.map((e) => e.message).join(', ')
  }
}
</script>
<template>
  <q-card class="q-pt-md">
    <div class="row">
      <div class="col">
        <q-input
          :model-value="houseComputed.familyName"
          @update:model-value="
            (newValue) => updateHouse(newValue ? String(newValue) : '', 'familyName')
          "
          label="family name"
          filled
          dense
          :rules="[(v) => isValidValue(v, 'familyName')]"
        >
          <template v-slot:prepend>
            <q-icon name="face" />
          </template>
        </q-input>
      </div>
    </div>
    <DriSelect
      v-model:family-members="houseComputed.familyMembers"
      @update:familyMembers="(newValue) => updateHouse(newValue, 'familyMembers')"
    />
  </q-card>
</template>
