<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fireFunc } from '@/models/fireFunctions'
import LoginUser from '@/components/atoms/LoginDialog.vue'
import RegisterDialog from './components/atoms/RegisterDialog.vue'
import { useAuthState } from '@/stores/mainStore'
import myToolBar from '@/components/atoms/myToolBar.vue'
import myPages from '@/components/atoms/myPages.vue'

const authState = useAuthState()
const router = useRouter()

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
  return
}
// const isLoggedIn = ref(true)
// runs after firebase is initialized

const logOut = () => {
  fireFunc.logOut()
  router.push('/')
}

const loginDialog = ref(false)
const registDialog = ref(false)
</script>

<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-secondary text-white" height-hint="50">
        <!-- Set theme color here -->
        <meta name="theme-color" content="#008080" />

        <myToolBar
          :toggleLeftDrawer="toggleLeftDrawer"
          :is-logged-in="authState.isLoggedin"
          :logOut="logOut"
          v-model:login-dialog="loginDialog"
          v-model:regist-dialog="registDialog"
        />

        <myPages />
      </q-header>

      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <!-- drawer content -->
        <q-btn dense flat round icon="highlight_off" @click="toggleLeftDrawer" />
        hey i am sidebar
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
    <login-user v-model:open-dialog="loginDialog" />
    <register-dialog v-model:open-dialog="registDialog" />
  </div>
</template>
