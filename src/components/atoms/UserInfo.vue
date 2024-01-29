<script setup lang="ts">
import * as myVal from '@/models/MyInterface'
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
  set(val) {
    emits('update:appUser', val)
  }
})
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
      :rules="[(val) => (val && val.length > 3) || 'Name should be longer than 3 characters']"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.job"
      label="Job"
      lazy-rules
      :rules="[(val) => (val && val.length > 3) || 'Job should be longer than 3 characters']"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.title"
      label="Title"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please fill in the title']"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.country"
      label="* Country"
      lazy-rules
      :rules="[(val) => (val && val.length > 3) || 'Conutry should be longer than 3 characters']"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.region"
      label="* region"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please fill in the region(optional)']"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.town"
      label="* town/city"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please fill in the town/city(optional)']"
    />
  </q-card>
</template>
