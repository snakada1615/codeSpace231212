<script setup lang="ts">
import * as myVal from 'src/models/MyInterface'
import { computed, ref, type PropType } from 'vue'
import DriSelect from '../atoms/DriSelect.vue'

const props = defineProps({
  location: {
    type: String,
    default: ''
  },
  familyAll: {
    type: Object as PropType<myVal.House>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:familyAll', value: myVal.House): void
  (e: 'saveFamilyAll', value: myVal.House): void
}>()

const familyMembersComputed = computed({
  get() {
    return props.familyAll.familyMembers
  },
  set(val) {
    const res = {
      ...props.familyAll,
      familyMembers: val
    }
    emits('update:familyAll', res)
  }
})

const familyNameComputed = computed({
  get() {
    return props.familyAll.familyName
  },
  set(val) {
    const res = {
      ...props.familyAll,
      familyName: val
    }
    emits('update:familyAll', res)
  }
})

const totalFamilySize = computed(() => {
  return props.familyAll.familyMembers.reduce((sum, current) => {
    sum += current.count
    return sum
  }, 0)
})

const myLocation = ref(props.location)

const addFamilyAll = () => {
  console.log(props.familyAll)
  emits('saveFamilyAll', props.familyAll)
}

const numberRules = computed(() => {
  return totalFamilySize.value > 0
})

const nameRules = computed(() => {
  const res = (familyNameComputed.value ? true : false) && familyNameComputed.value.length > 2
  return res
})
</script>

<template>
  <q-card class="q-pt-md">
    <div class="row">
      <div class="col-5">
        <q-input
          v-model:model-value="myLocation"
          label="location"
          class="q-px-sm"
          filled
          dense
          disable
        >
          <template v-slot:prepend>
            <q-icon name="flag" />
          </template>
        </q-input>
      </div>
      <div class="col-5">
        <q-input
          v-model:model-value="familyNameComputed"
          label="family name"
          class="q-px-sm"
          filled
          dense
          :error="!nameRules"
          error-message="'family name should be longer than 2 letters'"
        >
          <template v-slot:prepend>
            <q-icon name="face" />
          </template>
        </q-input>
      </div>
      <div class="col-2">
        <q-btn
          round
          ripple
          color="primary"
          icon="add"
          size="sm"
          :disable="!nameRules || !numberRules"
          @click="addFamilyAll"
        />
        save
      </div>
    </div>
    <DriSelect v-model:family-members="familyMembersComputed" />
  </q-card>
</template>
