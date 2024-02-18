// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/myTypes'
import { fireFunc } from '@/models/fireFunctions'
import FakerFunc from '@/models/fakerFunc'

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

interface PiniaState {
  // 現在利用しているユーザーの情報
  appUser: myVal.AppUser
  // ユーザーが取り組んでいるプロジェクトの情報
  projectInfo: myVal.ProjectInfo | myVal.ProjectInfoBlank
  fct: myVal.FctItems | null
  dri: myVal.DriItems | null
  // プロジェクトで対象とする家庭の情報
  houses: myVal.Houses | myVal.HousesBlank
  // 各家庭での食事調査結果
  menu: myVal.Menu | myVal.MenuBlank
  // デフォルトで使うデータベース名
  currentDataSet: myVal.CurrentDataSet
  // loading時のsplash画面表示
  loading: boolean
}

export const useProjectData = defineStore('prjData', {
  state: (): PiniaState => ({
    // 現在利用しているユーザーの情報
    appUser: myVal.appUserDefault,
    // ユーザーが取り組んでいるプロジェクトの情報
    projectInfo: myVal.projectInfoDefault,
    fct: [],
    dri: [],
    // プロジェクトで対象とする家庭の情報
    houses: [],
    // 各家庭での食事調査結果
    menu: [],
    currentDataSet: {
      fct: 'f530f2c6-d107-47c4-b246-237427d77279',
      dri: '82f6425d-def7-4094-9088-6672adfd525f',
      project: ''
    },
    loading: false
  }),

  getters: {
    stateUserId: (state) => {
      if (state.appUser && typeof state.appUser === 'object') {
        return !!state.appUser.userId || false
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
      return state.projectInfo.targetPopulation.reduce(
        (total, current) => (total += current.count),
        0
      )
    },

    houseSizes: (state) => {
      if (!state.houses) {
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
    setUserId(val: string) {
      this.appUser.userId = val
    },
    setFct(val: myVal.FctItems) {
      this.fct = JSON.parse(JSON.stringify(val))
    },
    setDri(val: myVal.DriItems) {
      this.dri = JSON.parse(JSON.stringify(val))
    },
    setAppUser(val: myVal.AppUser[]) {
      this.appUser = val[0]
    },
    setCurrentDataset(val: myVal.CurrentDataSet) {
      this.currentDataSet = JSON.parse(JSON.stringify(val))
    },
    setProjectInfo(val: myVal.ProjectInfo | myVal.ProjectInfoBlank) {
      this.projectInfo = JSON.parse(JSON.stringify(val))
    },
    setHouses(val: myVal.Houses) {
      this.houses = JSON.parse(JSON.stringify(val))
    },
    addNewHouse(val: myVal.House) {
      this.houses.push(JSON.parse(JSON.stringify(val)))
    },
    setMenu(val: myVal.Menu) {
      this.menu = JSON.parse(JSON.stringify(val))
    },
    async fireSetCurrentDataSet(userId: string, val: myVal.CurrentDataSet) {
      await fireFunc.fireSetMergeTyped<myVal.CurrentDataSet>('user', userId, val)
    },

    async fireSetFct(fctId: string, val: myVal.FctItemsWithNote) {
      await fireFunc.fireSetMergeTyped<myVal.FctItemsWithNote>('fct', fctId, val)
    },

    async fireSetDri(driId: string, val: myVal.DriItemsWithNote) {
      await fireFunc.fireSetMergeTyped<myVal.DriItemsWithNote>('dri', driId, val)
    },

    async fireSetAppUser(userId: string, val: myVal.AppUser) {
      await fireFunc.fireSetMergeTyped<myVal.AppUser>('user', userId, val)
    },

    async fireGetAllData(userId: string) {
      this.setUserId(userId)

      const currentFctId = this.currentDataSet.fct
      const currentDriId = this.currentDataSet.dri
      const currentProjectId = this.currentDataSet.project || FakerFunc.uuid()
      const defaultFamilyId = FakerFunc.uuid()
      const defaultMenuId = FakerFunc.uuid()

      //  fct:
      console.log('...fetching fct')
      const fctDat = await fireFunc.fireGetTyped<myVal.FctItems>('fct', currentFctId)
      if (fctDat) {
        this.setFct(fctDat)
        this.setCurrentDataset({
          ...this.currentDataSet,
          fct: currentFctId
        })
      } else {
        throw new Error('no FCT data available in fireStore')
      }

      //  dri:
      console.log('...fetching dri')
      const driDat = await fireFunc.fireGetTyped<myVal.DriItems>('dri', currentDriId)
      if (driDat) {
        this.setDri(driDat)
        this.setCurrentDataset({
          ...this.currentDataSet,
          dri: currentDriId
        })
      } else {
        throw new Error('no DRI data available in fireStore')
      }

      //  AppUser:
      await this.fireGetData<myVal.AppUser>(
        'user',
        'userId',
        userId,
        (userData) => this.setAppUser(userData),
        [
          {
            ...myVal.appUserDefault,
            userId: userId
          }
        ]
      )

      // project:
      console.log('fireGetProject')
      await this.fireGetData<myVal.ProjectInfo>(
        'projectInfo',
        'projectId',
        currentProjectId,
        (projectInfo) => this.setProjectInfo(projectInfo[0]),
        [
          {
            ...myVal.projectInfoDefault,
            userId: userId,
            projectId: currentProjectId
          }
        ]
      )

      // House:
      console.log('fireGetHouse')
      await this.fireGetData<myVal.House>(
        'house',
        'projectId',
        currentProjectId,
        (houseData) => this.setHouses(houseData), // houseData is already an array.
        [
          {
            ...myVal.houseDefault,
            userId: userId,
            projectId: currentProjectId,
            familyId: defaultFamilyId
          }
        ]
      )

      //  Menu:
      console.log('fireGetMenu')
      await this.fireGetData<myVal.MenuItem>(
        'menu',
        'projectId',
        currentProjectId,
        (menu) => this.setMenu(menu), // houseData is already an array.
        [
          {
            ...myVal.menuItemDefault,
            projectId: currentProjectId,
            KeyFamily: defaultFamilyId,
            menuItemId: defaultMenuId,
            userId: userId
          }
        ]
      )
    },

    async fireGetData<T>(
      collectionName: string,
      fieldName: string,
      fieldValue: string,
      setFunction: (data: T[]) => void, //戻り値を処理する関数を指定
      defaultData: T[]
    ) {
      const res = await fireFunc.fireGetQueryTyped<T>(collectionName, fieldName, fieldValue) // queryなので戻り値は常にT[]
      if (res && res.length > 0) {
        setFunction(res)
      } else {
        console.log(`${collectionName} data not available in server. Initializing data...`)
        setFunction(defaultData)
      }
    }
  }
})
