// import { defineStore } from 'pinia'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/models/fireFunctions'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import * as myVal from '@/models/MyInterface'

export const useAuthState = defineStore('auth', {
  state: () => ({
    isLoggedin: false
  }),
  actions: {
    setLoginState(val: boolean) {
      this.isLoggedin = val
    }
  }
})

export const useProjectData = defineStore('prjData', {
  state: () => ({
    appUser: myVal.appUserDefault,
    projectInfo: myVal.ProjectInfoDefault,
    fct: [myVal.fctItemDefault],
    dri: [myVal.driItemDefault],
    familyAll: myVal.familyAllDefault,
    menuItems: [myVal.menuItemDefault]
  }),
  actions: {
    setUserId(val: string) {
      this.appUser.userId = val
    },
    setAppUser(val: myVal.appUser) {
      this.appUser = val
    }
  }
})
// You would need to create a Pinia instance and install it as a plugin in your Vue app.

// export const userState = defineStore('userstate', () => {
//   const user = ref<User | null>(null)

// onAuthStateChanged(auth, (u) => {
//   user.value = u
// })

//   async function login(email: string, password: string) {
//     await signInWithEmailAndPassword(auth, email, password)
//   }

//   async function logout() {
//     await signOut(auth)
//   }

//   return {
//     user,
//     login,
//     logout
//   }
// })
