// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
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
      const res = await fireFunc.fireGetQueryTyped<myVal.ProjectInfo>(
        'projectInfos',
        'userId',
        userId
      )
      if (res) {
        this.setProjectInfos(res)
      }
    },

    async fireGetFct(userId: string) {
      const res = await fireFunc.fireGetQueryTyped<myVal.FctItem>('fct', 'userId', userId)
      if (res) {
        this.setFct(res)
      } else {
        throw new Error('no FCT data in firebase @mainStore/fireGetFct')
      }
    },

    async fireGetDri(userId: string) {
      const res = await fireFunc.fireGetQueryTyped<myVal.DriItem>('dci', 'userId', userId)
      if (res) {
        this.setDri(res)
      } else {
        throw new Error('no DRI data in firebase @mainStore/fireGetDri')
      }
    },

    async fireGetHouse(userId: string) {
      const res = await fireFunc.fireGetQueryTyped<myVal.House>('dci', 'userId', userId)
      if (res) {
        this.setHouses(res)
      }
    },

    async fireGetMenu(userId: string) {
      const res = await fireFunc.fireGetQueryTyped<myVal.Menu>('dci', 'userId', userId)
      if (res) {
        this.setMenues(res)
      }
    },

    async fireSetFct(fctId: string, val: myVal.FctItem) {
      await fireFunc.fireSetMergeTyped<myVal.FctItem>('fct', fctId, val)
    }
  }
})
