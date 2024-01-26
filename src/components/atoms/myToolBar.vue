<script setup lang="ts">
import { useProjectData } from '@/stores/mainStore'

defineProps<{
  toggleLeftDrawer: () => void
  isLoggedIn: boolean
  logOut: () => void
  loginDialog: boolean
  registDialog: boolean
}>()
const emits = defineEmits<{
  (e: 'update:loginDialog', value: boolean): void
  (e: 'update:registDialog', value: boolean): void
}>()

const projInfo = useProjectData()
</script>

<template>
  <q-toolbar>
    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

    <q-toolbar-title>
      <q-icon name="soup_kitchen" size="1em" />
      IFNA Nutrient App
    </q-toolbar-title>

    <!-- login/logout用のメニュー -->
    <!-- logout -->
    <q-btn v-if="isLoggedIn" flat round>
      <q-icon name="face" />
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section @click="logOut()">logOut</q-item-section>
          </q-item>
          <q-item>user: {{ projInfo.appUser.userId }}</q-item>
          <!-- Add more items here -->
        </q-list>
      </q-menu>
    </q-btn>

    <!-- login -->
    <q-btn v-if="!isLoggedIn" flat round>
      <q-icon name="psychology_alt" />
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section @click="emits('update:loginDialog', true)">logIn</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section @click="emits('update:registDialog', true)">register</q-item-section>
          </q-item>
          <!-- Add more items here -->
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>
