<script setup lang="ts">
import * as myVal from '@/models/MyInterface'
import { computed, type PropType } from 'vue'
import DriSelect from '@/components/atoms/DriSelect.vue'

const props = defineProps({
  projectInfo: {
    type: Object as PropType<myVal.ProjectInfo>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:projectInfo', value: myVal.ProjectInfo): void
  (e: 'saveProjectInfo', value: myVal.ProjectInfo): void
}>()

const familyMembersComputed = computed({
  get() {
    return props.projectInfo.targetPopulation
  },
  set(val) {
    const res = {
      ...props.projectInfo,
      familyMembers: val
    }
    emits('update:projectInfo', res)
  }
})

const totalFamilySize = computed(() => {
  return props.projectInfo.targetPopulation.reduce((sum, current) => {
    sum += current.count
    return sum
  }, 0)
})

const locationComputed = computed({
  get() {
    return props.projectInfo.location
  },
  set(val) {
    const res = {
      ...props.projectInfo,
      location: val
    }
    emits('update:projectInfo', res)
  }
})

const projectNameComputed = computed({
  get() {
    return props.projectInfo.projectName
  },
  set(val) {
    const res = {
      ...props.projectInfo,
      projectName: val
    }
    emits('update:projectInfo', res)
  }
})

const addProjectInfo = () => {
  console.log(props.projectInfo)
  emits('saveProjectInfo', props.projectInfo)
}

const nameRules = computed(() => {
  const res = (projectNameComputed.value ? true : false) && projectNameComputed.value.length > 2
  return res
})

const numberRules = computed(() => {
  return totalFamilySize.value > 0
})
</script>

<template>
  <q-card class="q-pt-md">
    <div class="row">
      <div class="col-5">
        <q-input
          v-model:model-value="locationComputed"
          label="location"
          class="q-px-sm"
          filled
          dense
          :error="!nameRules"
          error-message="'location name should be longer than 2 letters'"
        >
          <template v-slot:prepend>
            <q-icon name="flag" />
          </template>
        </q-input>
      </div>
      <div class="col-5">
        <q-input
          v-model:model-value="projectNameComputed"
          label="project name"
          class="q-px-sm"
          filled
          dense
          :error="!nameRules"
          error-message="'Project name should be longer than 2 letters'"
        >
          <template v-slot:prepend>
            <q-icon name="edit_note" />
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
          @click="addProjectInfo"
        />
        save
      </div>
    </div>
    <DriSelect :family-members="familyMembersComputed" />
  </q-card>
</template>
