<script setup lang="ts">
import * as myVal from '@/models/MyInterface'
import { computed, type PropType } from 'vue'
import DriSelect from '../atoms/DriSelect.vue'

const props = defineProps({
  familyMembers: {
    type: Object as PropType<myVal.FamilyMembers>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:familyMembers', value: myVal.FamilyMembers): void
}>()

const familyMembersComputed = computed({
  get() {
    return props.familyMembers
  },
  set(val) {
    emits('update:familyMembers', val)
  }
})
</script>
<template>
  <q-card> halo</q-card>
  <DriSelect v-model:family-members="familyMembersComputed" />
</template>
