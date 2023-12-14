<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
const clickBtn = () => {
  emit('click')
}

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn color="primary" icon="mail" label="On Left" @click="clickBtn" />
    <q-btn color="secondary" icon-right="mail" label="On Right" />
    <q-btn color="red" icon="mail" icon-right="send" label="On Left and Right" />
    <br />
    <q-btn icon="phone" label="Stacked" stack glossy color="purple" />
    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ title }}
      </q-card-section>
    </q-card>
  </div>
</template>
