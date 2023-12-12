<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
  return
}
</script>

<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <!-- ヘッダー（ツールバー設定） -->
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            <q-icon name="soup_kitchen" size="2em" />
            Title
          </q-toolbar-title>
        </q-toolbar>

        <!-- ヘッダー（タブ設定） -->
        <q-tabs align="left">
          <q-route-tab to="/" label="Page One" />
          <q-route-tab to="/" label="Page Two" />
          <q-route-tab to="/about" label="Page Three" />
        </q-tabs>
      </q-header>

      <!-- サイドバー設定 -->
      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <!-- drawer content -->
        <q-btn dense flat round icon="highlight_off" @click="toggleLeftDrawer" />
        hey i am sidebar
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>
