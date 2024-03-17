<script setup lang="ts">
import * as myVal from '@/models/myTypes'
import { computed, defineEmits, type PropType } from 'vue'
// import { useProjectData } from '@/stores/mainStore'
// import { ref } from 'vue'

const props = defineProps({
  user: {
    type: Object as PropType<myVal.User>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:user', value: myVal.User): void
}>()

const userComp = computed({
  get() {
    return props.user
  },
  set(val: myVal.User_v) {
    emits('update:user', val)
  }
})

function isValidValue(
  val: number | string | null,
  key: 'name' | 'job' | 'title' | 'country' | 'region' | 'town'
): boolean | string {
  const result = myVal.UserZod_v.shape[key].safeParse(val)
  if (result.success) {
    return true // Or some validation logic that returns a boolean
  } else {
    console.log(result.error.errors)
    return result.error.errors.map((e) => e.message).join(', ')
  }
}
</script>

<template>
  <q-card>
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="userComp.name"
      label="* Name"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'name')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="userComp.job"
      label="Job"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'job')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="userComp.title"
      label="Title"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'title')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="userComp.country"
      label="* Country"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'country')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="userComp.region"
      label="* region"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'region')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="userComp.town"
      label="* town/city"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'town')]"
    />
    <q-btn class="q-ma-sm" label="Save it" dense />
  </q-card>
</template>
