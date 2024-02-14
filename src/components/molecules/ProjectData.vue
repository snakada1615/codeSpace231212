<script setup lang="ts">
import * as myVal from '@/models/myTypes'
import { computed, type PropType } from 'vue'
import DriSelect from '@/components/atoms/DriSelect.vue'

const props = defineProps({
  projectInfo: {
    type: Object as PropType<myVal.ProjectInfo | myVal.ProjectInfoBlank>,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:projectInfo', value: myVal.ProjectInfo): void
  (e: 'saveProjectInfo', value: myVal.ProjectInfo): void
}>()

const projectInfoComputed = computed(() => {
  return props.projectInfo || myVal.projectInfoDefault
})

const familyMembersComputed = computed({
  get() {
    return projectInfoComputed.value.targetPopulation
  },
  set(val) {
    const res = {
      ...projectInfoComputed.value,
      familyMembers: val
    }
    emits('update:projectInfo', res)
  }
})

const totalFamilySize = computed(() => {
  return projectInfoComputed.value.targetPopulation.reduce((sum, current) => {
    sum += current.count
    return sum
  }, 0)
})

const locationComputed = computed({
  get() {
    return projectInfoComputed.value.location
  },
  set(val) {
    const res = {
      ...projectInfoComputed.value,
      location: val
    }
    emits('update:projectInfo', res)
  }
})

const projectNameComputed = computed({
  get() {
    return projectInfoComputed.value.projectName
  },
  set(val) {
    const res = {
      ...projectInfoComputed.value,
      projectName: val
    }
    emits('update:projectInfo', res)
  }
})

const addProjectInfo = () => {
  console.log(projectInfoComputed.value)
  emits('saveProjectInfo', projectInfoComputed.value)
}

const nameRules = computed(() => {
  const res = (projectNameComputed.value ? true : false) && projectNameComputed.value.length > 2
  return res
})

const numberRules = computed(() => {
  return totalFamilySize.value > 0
})

function isValidValue(
  val: number | string | null,
  key: 'projectName' | 'projectId' | 'locationId' | 'location' | 'targetPopulation'
): boolean | string {
  const result = myVal.ProjectInfoZod.shape[key].safeParse(val)
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
          v-model:model-value="locationComputed"
          label="location"
          class="q-px-sm"
          filled
          dense
          :rules="[(v) => isValidValue(v, 'location')]"
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
          :rules="[(v) => isValidValue(v, 'projectName')]"
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
