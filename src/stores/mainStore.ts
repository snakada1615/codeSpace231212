// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/myTypes'
import { fireFunc } from '@/models/fireFunctions'
import { Dialog, Notify } from 'quasar'

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

// Define a type for the acceptable types of state values
type StateValue = string | number | boolean | object | null // Add more as needed

export const useProjectData = defineStore('prjData', {
  state: (): myVal.PiniaState => ({
    // 現在利用しているユーザーの情報
    appUser: myVal.appUserDefault,
    // ユーザーが取り組んでいるプロジェクトの情報
    projectInfo: myVal.projectInfoDefault,
    fct: null,
    dri: null,
    // プロジェクトで対象とする家庭の情報
    house: myVal.housesDefault,
    // 各家庭での食事調査結果
    menu: null,
    currentDataSet: myVal.currentDataSetDefault,
    loading: false,
    copyDataFromOrigin: {
      fct: '08e5ee1f-8321-4cc3-8b9f-00619a262931',
      dri: '5139dec2-f340-46bd-aed4-57670991bab7'
    },
    isUpdate: false,
    modifiedStates: [] as Array<keyof myVal.PiniaState>
  }),

  getters: {
    stateUserId: (state) => {
      if (state.appUser && typeof state.appUser === 'object') {
        return !!state.appUser.user || false
      }
      return false
      // state.appUser.state.appUser.userId? true:false
    },
    stateUserInfo(state) {
      const result = myVal.AppUserZod.safeParse(state.appUser)
      if (result.success) {
        return true // Or some validation logic that returns a boolean
      } else {
        return result.error.errors.map((e) => e.message).join(', ')
      }
    },

    stateProjectInfo(state) {
      const result = myVal.ProjectInfoZod.safeParse(state.projectInfo)
      if (result.success) {
        return true // Or some validation logic that returns a boolean
      } else {
        return result.error.errors.map((e) => e.message).join(', ')
      }
    },

    targetPopulationTotal: (state) => {
      if (!state.projectInfo) {
        return 0
      }
      if (!state.projectInfo.targetPopulation) {
        return 0
      }
      return state.projectInfo.targetPopulation.reduce(
        (total, current) => (total += current.count),
        0
      )
    },

    houseSizes: (state) => {
      if (!state.house) {
        return 0
      }
      if (!state.house[0]) {
        return 0
      }
      return state.house.map((house) =>
        house.familyMembers.reduce((total, current) => (total += current.count), 0)
      )
    },

    stateHouses(state) {
      const myHouseSize = this.houseSizes

      // Check if houseSizes is not an array or is empty, return false early.
      if (!Array.isArray(myHouseSize) || !myHouseSize.length) {
        return 'no house registered'
      }

      // Ensure all houses meet the conditions
      const result = myVal.HousesZod.safeParse(state.house)
      if (result.success) {
        return true // Or some validation logic that returns a boolean
      } else {
        return result.error.errors.map((e) => e.message).join(', ')
      }
    },

    stateMenu(state) {
      const result = myVal.MenuItemsZod.safeParse(state.menu)
      if (result.success) {
        return true // Or some validation logic that returns a boolean
      } else {
        return result.error.errors.map((e) => e.message).join(', ')
      }
    }
  },
  actions: {
    // Function to update state value and record the change
    // TODO anyを取り除きたい
    updateStateValue<K extends keyof myVal.PiniaState>(fieldName: K, value: myVal.PiniaState[K]) {
      // Assuming this is typed to have the same structure as PiniaState
      const currentStateValue = this[fieldName]

      // Use a type guard to check for the equality and only assign if different
      if (currentStateValue !== value) {
        // Directly assign the value since we've asserted they are the same type
        ;(this as any)[fieldName] = value

        // Record the modification if not already recorded
        if (!this.modifiedStates.includes(fieldName)) {
          this.modifiedStates = [fieldName, ...this.modifiedStates]
          console.log(this.modifiedStates)
        }
      }
    },

    // TODO fireUpdateStateValue: fireStoreに値をセットしてmodifiedStatesをクリア
    async fireUpdateStateValue(collectionName: string, docId: string) {
      // Ensure updates object respects the state structure
      const updates: Partial<Record<keyof myVal.PiniaState, StateValue>> = {}
      // const updates: myVal.PiniaState_partial = {}

      for (const fieldName of this.modifiedStates) {
        const res = this[fieldName]
        updates[fieldName] = res
      }

      console.log('updates...')
      console.log(updates)

      if (Object.keys(updates).length > 0) {
        await fireFunc.fireUpdateTyped(
          collectionName,
          docId,
          updates as myVal.PiniaState_partial,
          'piniaStatePartial'
        )
      }
      // Your Firestore document reference, now with a converter applied
      // const documentRef = doc(collectionName, docId).withConverter(yourStoreConverter)
      // await updateDoc(documentRef, updates)
      // await fireFunc.fireSetMergeTyped<myVal.PiniaState_partial>(
      //   collectionName,
      //   docId,
      //   updates as myVal.PiniaState_partial
      // )

      this.modifiedStates = []
    },

    // NOTE fireResetData: userIdに紐づいたデータの削除、初期化
    async fireResetData(userId: string) {
      try {
        await fireFunc.fireDeleteQueryDoc('dri', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('fct', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('user', 'user', userId)
        console.log('all data cleared')
        console.log('initialize all data for ' + userId)
        this.fireGetUserData(userId)
      } catch (error) {
        console.log(error)
      }
    },

    // NOTE fireGetUserData: userが変わるたびに初期化
    async fireGetUserData(userId: string) {
      try {
        const res = await fireFunc.fireGetTyped('user', userId)
        if (res) {
          console.log('fireGetUserData: fetch success')
          this.appUser = res.appUser
          this.projectInfo = res.projectInfo
          this.fct = res.fct
          this.dri = res.dri
          this.house = res.house
          this.menu = res.menu
          this.currentDataSet = res.currentDataSet
          // this.loading = res.loading
          // this.copyDataFromOrigin = res.copyDataFromOrigin
          // this.isUpdate = res.isUpdate
          // this.modifiedStates = res.modifiedStates
        } else {
          console.log('fireGetUserData: fetch fail')

          // オリジナルのFCTをコピーして複製
          const newFct = await fireFunc.fireGetTyped('fct', this.copyDataFromOrigin['fct'])

          // オリジナルのDRIをコピーして複製
          const newDri = await fireFunc.fireGetTyped('dri', this.copyDataFromOrigin['dri'])

          // オリジナルが見つからなければエラーを出して終了
          if (!newFct || !newDri) {
            throw new Error('no original data for fct/dri')
          }

          const myAppUser = { ...myVal.appUserDefault, user: userId }
          this.appUser = myAppUser
          this.projectInfo = { ...myVal.projectInfoDefault, user: userId }
          this.fct = newFct
          this.dri = newDri
          this.house = myVal.housesDefault
          this.menu = myVal.menuesDefault
          this.currentDataSet = myVal.currentDataSetDefault
          this.loading = false

          // 初期値をfireStoreにセットする
          this.modifiedStates = [
            'appUser',
            'fct',
            'dri',
            'house',
            'menu',
            'currentDataSet',
            'copyDataFromOrigin'
          ]
          await this.fireUpdateStateValue('user', userId)
        }
      } catch (error) {
        throw new Error('error')
      }
      return true
    }
  }
})
