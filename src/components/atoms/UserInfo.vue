<script setup lang="ts">
import * as myVal from '@/models/myTypes'
import { computed, defineEmits, type PropType } from 'vue'
import { z } from 'zod'
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

const myName = computed({
  get() {
    return props.user.name
  },
  set(val: z.infer<typeof myVal.UserZod_v.shape.name>) {
    emits('update:user', {
      ...props.user,
      name: val
    })
  }
})

const myJob = computed({
  get() {
    return props.user.job
  },
  set(val: z.infer<typeof myVal.UserZod_v.shape.job>) {
    emits('update:user', {
      ...props.user,
      job: val
    })
  }
})

const myTitle = computed({
  get() {
    return props.user.title
  },
  set(val: z.infer<typeof myVal.UserZod_v.shape.title>) {
    emits('update:user', {
      ...props.user,
      title: val
    })
  }
})

const myCountry = computed({
  get() {
    return props.user.country
  },
  set(val: z.infer<typeof myVal.UserZod_v.shape.country>) {
    emits('update:user', {
      ...props.user,
      country: val
    })
  }
})

const myRegion = computed({
  get() {
    return props.user.region
  },
  set(val: z.infer<typeof myVal.UserZod_v.shape.region>) {
    emits('update:user', {
      ...props.user,
      region: val
    })
  }
})

const myTown = computed({
  get() {
    return props.user.town
  },
  set(val: z.infer<typeof myVal.UserZod_v.shape.town>) {
    emits('update:user', {
      ...props.user,
      town: val
    })
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
      v-model="myName"
      label="* Name"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'name')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="myJob"
      label="Job"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'job')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="myTitle"
      label="Title"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'title')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="myCountry"
      label="* Country"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'country')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="myRegion"
      label="* region"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'region')]"
    />
    <q-input
      dense
      filled
      class="q-my-sm"
      v-model="myTown"
      label="* town/city"
      lazy-rules
      :rules="[(v) => isValidValue(v, 'town')]"
    />
  </q-card>
</template>
