<script lang="ts" setup>
import * as myVal from 'src/models/myTypes'
import { computed, type PropType } from 'vue'
import DriSelect from '../atoms/DriSelect.vue'

const props = defineProps({
  house: {
    type: Object as PropType<myVal.House | myVal.HouseBlank | null>,
    required: true
  }
})

const houseComputed = computed(() => {
  if (props.house === null) {
    return myVal.houseDefault
  } else {
    return props.house
  }
})

const emits = defineEmits<{
  (e: 'submit', value: myVal.House | myVal.HouseBlank | null): void
  (e: 'update:house', value: myVal.House): void
  (e: 'saveFamilyAll', value: myVal.House): void
}>()

let elemIdKey: 'familyName' | 'locationId'
interface HouseIndexed extends myVal.House {
  [key: string]: any
}

function updateHouse(val: string | number | null, elemId: typeof elemIdKey) {
  // Clone the current houseComputed.value
  let res: HouseIndexed = { ...houseComputed.value }

  // Assign the new value to the field represented by elemId if it exists.
  if (Object.keys(res).includes(elemId)) {
    res[elemId] = (typeof val === 'number' ? val.toString() : val) || ''
  }

  // Emit the updated house object
  emits('update:house', res)
}

function isValidValue(
  val: number | string | null,
  key: 'locationId' | 'familyName'
): boolean | string {
  const result = myVal.HouseZod.shape[key].safeParse(val)
  if (result.success) {
    return true // Or some validation logic that returns a boolean
  } else {
    console.log(result.error.errors)
    return result.error.errors.map((e) => e.message).join(', ')
  }
}
</script>
<template>
  <q-card class="q-pt-md">
    <div class="row">
      <div class="col-5">
        <q-input
          :model-value="houseComputed.locationId"
          @update:model-value="(newValue) => updateHouse(newValue, 'locationId')"
          label="location"
          class="q-px-sm"
          filled
          dense
          lazy-rules
          :rules="[(v) => isValidValue(v, 'locationId')]"
        >
          <template v-slot:prepend>
            <q-icon name="flag" />
          </template>
        </q-input>
      </div>
      <div class="col-5">
        <q-input
          :model-value="houseComputed.familyName"
          @update:model-value="(newValue) => updateHouse(newValue, 'familyName')"
          label="family name"
          class="q-px-sm"
          filled
          dense
          lazy-rules
          :rules="[(v) => isValidValue(v, 'familyName')]"
        >
          <template v-slot:prepend>
            <q-icon name="face" />
          </template>
        </q-input>
      </div>
    </div>
    <DriSelect v-model:family-members="houseComputed.familyMembers" />
  </q-card>
</template>
