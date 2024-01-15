<template>
  <q-card>
    <q-form @submit.prevent="onSubmit" class="q-gutter-md q-pa-md">
      <q-input
        dense
        filled
        class="q-my-sm"
        v-model="appUser.name"
        label="Name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please fill in the name']"
      />
      <q-input
        dense
        filled
        class="q-my-sm"
        v-model="appUser.job"
        label="Job"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please fill in the job']"
      />
      <q-input
        dense
        filled
        class="q-my-sm"
        v-model="appUser.title"
        label="Title"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please fill in the title']"
      />
      <q-input
        dense
        filled
        class="q-my-sm"
        v-model="appUser.country"
        label="Country"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please fill in the country']"
      />
      <q-input
        dense
        filled
        class="q-my-sm"
        v-model="appUser.region"
        label="region"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please fill in the region(optional)']"
      />
      <q-input
        dense
        filled
        class="q-my-sm"
        v-model="appUser.town"
        label="town/city"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please fill in the town/city(optional)']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" @click="onReset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as myVal from '@/models/MyInterface'
import type { PropType } from 'vue'

const props = defineProps({
  appUser: {
    type: Object as PropType<myVal.appUser>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:appUser', value: myVal.appUser): void
}>()

const appUser = ref<myVal.appUser>(props.appUser)

function onSubmit() {
  console.log('Form submitted:', appUser.value)
  emits('update:appUser', appUser.value)
  // Handle the form submission logic here.
}

function onReset() {
  appUser.value = myVal.appUserDefault
}
</script>
