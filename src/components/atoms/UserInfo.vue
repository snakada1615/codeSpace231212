<script setup lang="ts">
import * as myVal from '@/models/myTypes'
import { computed, defineEmits, type PropType } from 'vue'
// import { useProjectData } from '@/stores/mainStore'
// import { ref } from 'vue'

const props = defineProps({
  appUser: {
    type: Object as PropType<myVal.AppUser>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:appUser', value: myVal.AppUser): void
}>()

const appUserComp = computed({
  get() {
    return props.appUser
  },
  set(val: myVal.AppUser_v) {
    emits('update:appUser', val)
  }
})

function isValidValue(
  val: number | string | null,
  key: 'name' | 'job' | 'title' | 'country' | 'region' | 'town'
): boolean | string {
  const result = myVal.AppUserZod_v.shape[key].safeParse(val)
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
      v-model="appUserComp.name"
      label="* Name"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'name')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.job"
      label="Job"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'job')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.title"
      label="Title"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'title')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.country"
      label="* Country"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'country')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.region"
      label="* region"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'region')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.town"
      label="* town/city"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'town')]"
    />
    <q-btn class="q-ma-sm" label="Save it" dense />
  </q-card>
</template>
