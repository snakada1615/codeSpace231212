// import { defineStore } from 'pinia'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/models/fireFunctions'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'

export const AuthState = defineStore('counter', {
  state: () => ({
    isLoggedin: false
  }),
  actions: {
    setLoginState(val: boolean) {
      this.isLoggedin = val
    }
  }
})

export const useUserState = defineStore('userstate', {
  state: () => ({
    user: onAuthStateChanged(auth, (u) => {
      console.log('change login status')
      return u
    })
  }),
  getters: {
    isLoggedin: (state) => (state.user === null ? true : false)
  },
  actions: {
    setLoginState(val: boolean) {
      console.log(val)
    },
    // setUser(u) {
    //   this.user = u
    // },
    async login(email: string, password: string) {
      await signInWithEmailAndPassword(auth, email, password)
    },
    async logout() {
      await signOut(auth)
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
