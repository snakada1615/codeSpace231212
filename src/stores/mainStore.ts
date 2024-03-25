// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/myTypes'
import { fireFunc } from '@/models/fireFunctions'
// import { Dialog, Notify } from 'quasar'

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
    user: myVal.userDefault,
    // ユーザーが取り組んでいるプロジェクトの情報
    projectInfo: myVal.projectInfoDefault,
    fct: null,
    dri: null,
    // プロジェクトで対象とする家庭の情報
    houses: null,
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
      if (state.user && typeof state.user === 'object') {
        return !!state.user.user || false
      }
      return false
    },
    stateUserInfo(state) {
      const result = myVal.UserZod.safeParse(state.user)
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
      if (!state.houses) {
        return 0
      }
      if (!state.houses[0]) {
        return 0
      }
      return state.houses.map((house) =>
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
      const result = myVal.HousesZod.safeParse(state.houses)
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
    // NOTE updateModifiedState
    updateModifiedState<K extends keyof myVal.PiniaState>(fieldName: K) {
      if (!this.modifiedStates.includes(fieldName)) {
        this.modifiedStates = [fieldName, ...this.modifiedStates]
      }
    },

    // NOTE clearModifiedState
    clearModifiedState() {
      this.modifiedStates = []
    },

    // Function to update state value and record the change
    // TODO updateStateValue - this as anyを取り除きたい
    updateStateValue<K extends keyof myVal.PiniaState>(
      fieldName: K,
      value: myVal.PiniaState[K],
      options?: { silent?: boolean; firstLoad?: boolean }
    ) {
      // Assuming this is typed to have the same structure as PiniaState
      const currentStateValue = this[fieldName]

      // valueがpiniaよりも新しい値の場合のみ更新する(firstLoadだと全て上書き)
      if (currentStateValue !== value || options?.firstLoad) {
        // Directly assign the value since we've asserted they are the same type
        ;(this as any)[fieldName] = value

        // Record the modification if not already recorded
        if (!options?.silent) {
          this.updateModifiedState(fieldName)
        }
      }
    },

    // NOTE fireUpdateStateValue: firebaseの更新
    async fireUpdateStateValue<K extends keyof myVal.ConverterTypeMap>(
      collectionName: string,
      docId: string,
      docType: K,
      value: myVal.ConverterTypeMap[K]
    ) {
      await fireFunc.fireSetTyped(collectionName, docId, docType, value)
    },

    // NOTE fireUpdateAll: fireStoreに値をセットしてmodifiedStatesをクリア
    async fireUpdateAll(
      collectionName: string,
      docId: string
      // docType: keyof myVal.ConverterTypeMap,
      // options?: { new?: boolean }
    ) {
      // Ensure updates object respects the state structure
      const updates: Partial<Record<keyof myVal.PiniaState, StateValue>> = {}
      // const updates: myVal.PiniaState_partial = {}

      for (const fieldName of this.modifiedStates) {
        updates[fieldName] = this[fieldName]
      }

      if (Object.keys(updates).length > 0) {
        await fireFunc.fireSetMergeTyped(
          'user',
          docId,
          'piniaStatePartial',
          updates as myVal.PiniaState_partial
        )
        this.clearModifiedState()
      }
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
        const res = await fireFunc.fireGetTyped('user', userId, 'piniaStateForFire')
        if (res) {
          console.log('fireGetUserData: fetch success')
          this.updateStateValue('user', res.user, { silent: true })
          this.updateStateValue('projectInfo', res.projectInfo, { silent: true })
          this.updateStateValue('fct', res.fct, { silent: true })
          this.updateStateValue('dri', res.dri, { silent: true }) 
          this.updateStateValue('houses', res.houses, { silent: true })
          this.updateStateValue('menu', res.menu, { silent: true })
          this.updateStateValue('currentDataSet', res.currentDataSet, { silent: true })
        } else {
          console.log('fireGetUserData: fetch fail')

          // オリジナルのFCTをコピーして複製
          const newFct = await fireFunc.fireGetTyped('fct', this.copyDataFromOrigin['fct'], 'fct')

          // オリジナルのDRIをコピーして複製
          const newDri = await fireFunc.fireGetTyped('dri', this.copyDataFromOrigin['dri'], 'dri')

          // オリジナルが見つからなければエラーを出して終了
          if (!newFct || !newDri) {
            throw new Error('no original data for fct/dri')
          }

          const myUser = { ...myVal.userDefault, user: userId }
          this.updateStateValue('user', myUser, { firstLoad: true })
          this.updateStateValue(
            'projectInfo',
            { ...myVal.projectInfoDefault, user: userId },
            { firstLoad: true }
          )
          this.updateStateValue('fct', newFct, { firstLoad: true })
          this.updateStateValue('dri', newDri, { firstLoad: true })
          this.updateStateValue('houses', null, { firstLoad: true })
          this.updateStateValue('menu', null, { firstLoad: true })
          this.updateStateValue('currentDataSet', myVal.currentDataSetDefault, { firstLoad: true })
          this.updateStateValue('loading', false, { silent: true })

          // 初期値のセットなので、new:true
          await this.fireUpdateAll('user', userId)
          console.log('data have been initialized! for' + userId)
        }
      } catch (error) {
        throw new Error('error')
      }
      return true
    }
  }
})
