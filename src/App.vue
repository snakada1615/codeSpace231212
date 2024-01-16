<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fireFunc } from '@/models/fireFunctions'
import LoginUser from '@/components/atoms/LoginDialog.vue'
import RegisterDialog from './components/atoms/RegisterDialog.vue'
import { useAuthState } from '@/stores/mainStore'

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
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            <q-icon name="soup_kitchen" size="1em" />
            IFNA Nutrient App
          </q-toolbar-title>

          <!-- login/logout用のメニュー -->
          <!-- logout -->
          <q-btn v-if="authState.isLoggedin" flat round>
            <q-icon name="face" />
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="logOut()">logOut</q-item-section>
                </q-item>
                <!-- Add more items here -->
              </q-list>
            </q-menu>
          </q-btn>

          <!-- login -->
          <q-btn v-if="!authState.isLoggedin" flat round>
            <q-icon name="psychology_alt" />
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="loginDialog = true">logIn</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="registDialog = true">register</q-item-section>
                </q-item>
                <!-- Add more items here -->
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>

        <q-tabs align="left" class="bg-teal-3 text-black">
          <q-route-tab to="/start" label="Page One" />
          <q-route-tab to="/setUserInfo" label="user info" />
          <q-route-tab to="/setProjectInfo" label="Project info" />
          <q-route-tab to="/myTest01" label="myTest01" />
          <q-route-tab to="/feedTest" label="feedTest" />
        </q-tabs>
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
