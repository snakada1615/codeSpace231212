// import { defineStore } from 'pinia'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '@/models/fireFunctions'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import * as myVal from '@/models/MyInterface'
import { fireFunc } from '@/models/fireFunctions'

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
    projectInfos: [myVal.projectInfoDefault],
    fct: [myVal.fctItemDefault],
    dri: [myVal.driItemDefault],
    menues: [{ items: [myVal.menuItemDefault], projectId: myVal.projectInfoDefault.projectId }],
    houses: [myVal.houseDefault]
  }),
  actions: {
    setUserId(val: string) {
      this.appUser.userId = val
    },
    setFct(val: myVal.FctItems) {
      this.fct = val
    },
    setDri(val: myVal.DriItems) {
      this.dri = val
    },
    setAppUser(val: myVal.appUser) {
      this.appUser = val
    },
    setProjectInfos(val: myVal.ProjectInfos) {
      this.projectInfos = val
    },
    setHouses(val: myVal.Houses) {
      this.houses = val
    },
    setMenues(val: myVal.Menues) {
      this.menues = val
    },

    async fireGetProject(userId: string) {
      const res = await fireFunc.fireGetQueryProject('projectInfos', 'userId', userId)
      if (res) {
        this.setProjectInfos(res)
      }
    },
    async fireGetFct(userId: string) {
      const res = await fireFunc.fireGetQueryFct('fct', 'userId', userId)
      if (res) {
        this.setFct(res)
      } else {
        throw new Error('no FCT data in firebase @mainStore/fireGetFct')
      }
    },
    async fireGetDri(userId: string) {
      const res = await fireFunc.fireGetQueryDri('dci', 'userId', userId)
      if (res) {
        this.setDri(res)
      } else {
        throw new Error('no DRI data in firebase @mainStore/fireGetDri')
      }
    },
    async fireGetHouse(userId: string) {
      const res = await fireFunc.fireGetQueryHouses('dci', 'userId', userId)
      if (res) {
        this.setHouses(res)
      }
    },
    async fireGetMenu(userId: string) {
      const res = await fireFunc.fireGetQueryMenues('dci', 'userId', userId)
      if (res) {
        this.setMenues(res)
      }
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
