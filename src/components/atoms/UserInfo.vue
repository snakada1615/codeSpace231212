<template>
  <q-card>
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.name"
      label="* Name"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please fill in the name']"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="appUserComp.job"
      label="Job"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please fill in the job']"
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
      :rules="[(val) => (val && val.length > 0) || 'Please fill in the country']"
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
    {{ myProjectData.appUser }}
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as myVal from '@/models/MyInterface'
import { computed, defineEmits, type PropType } from 'vue'
import { useProjectData } from '@/stores/mainStore'
const myProjectData = useProjectData()

const props = defineProps({
  appUser: {
    type: Object as PropType<myVal.appUser>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:appUser', value: myVal.appUser): void
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
