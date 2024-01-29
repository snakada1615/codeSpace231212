// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/MyInterface'
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

export const useProjectData = defineStore('prjData', {
  state: () => ({
    // 現在利用しているユーザーの情報
    appUser: myVal.appUserDefault,
    // ユーザーが取り組んでいるプロジェクトの情報
    projectInfo: myVal.projectInfoDefault,
    fct: [myVal.fctItemDefault],
    dri: [myVal.driItemDefault],
    // プロジェクトで対象とする家庭の情報
    houses: [myVal.houseDefault],
    // 各家庭での食事調査結果
    menu: [myVal.menuItemDefault],
    fctDefault: 'f530f2c6-d107-47c4-b246-237427d77279', // 初期データを確保
    driDefault: '82f6425d-def7-4094-9088-6672adfd525f' // 初期データを確保
  }),

  getters: {
    stateUserId: (state) => state.appUser.userId,
    stateUserInfo: (state) =>
      state.appUser.country.length > 0 &&
      state.appUser.region.length > 0 &&
      state.appUser.name.length > 0 &&
      state.appUser.job.length > 0 &&
      state.appUser.title.length > 0 &&
      state.appUser.userId.length > 0,

    stateProjectInfo(state): boolean {
      return (
        state.projectInfo.projectId.length > 0 &&
        state.projectInfo.userId.length > 0 &&
        state.projectInfo.location.length > 0 &&
        this.targetPopulationTotal > 0
      )
    },

    targetPopulationTotal: (state) =>
      state.projectInfo.targetPopulation.reduce((total, current) => (total += current.count), 0),

    houseSizes: (state) =>
      state.houses.map((house) =>
        house.familyMembers.reduce((total, current) => (total += current.count), 0)
      ),

    stateHouses(state): boolean {
      const myHouseSize = this.houseSizes
      console.log(myHouseSize)

      // Check if houseSizes is not an array or is empty, return false early.
      if (!Array.isArray(myHouseSize) || !myHouseSize.length) {
        return false
      }

      // Ensure all houses meet the conditions
      return state.houses.every(
        (house, index) =>
          house.familyId && house.projectId && house.userId && myHouseSize[index] > 0
      )
    },

    stateMenue(state): boolean {
      return state.menu.every((menuItem) => {
        menuItem.userId.length > 0 &&
          menuItem.projectId.length > 0 &&
          menuItem.KeyFamily.length > 0 &&
          menuItem.MenuName.length > 0 &&
          menuItem.Weight > 0
      })
    }
  },

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
    setAppUser(val: myVal.AppUser[]) {
      this.appUser = val[0]
    },
    setCurrentDataset(val: myVal.CurrentDataSet) {
      this.appUser.currentDataSet = val
    },
    setProjectInfo(val: myVal.ProjectInfo) {
      this.projectInfo = val
    },
    setHouses(val: myVal.Houses) {
      this.houses = val
    },
    setMenu(val: myVal.Menu) {
      this.menu = val
    },

    async fireGetAllData(userId: string) {
      this.setUserId(userId)
      // await this.getDataFire(userId, 'fct', myVal.driItemsWIthNoteDefault)
      // await this.getDataFire(userId, 'dri', myVal.fctItemsWIthNoteDefault)

      const currentFctId = this.appUser.currentDataSet.fct || this.fctDefault
      const currentDriId = this.appUser.currentDataSet.dri || this.driDefault
      const currentProjectId = this.appUser.currentDataSet.project || FakerFunc.uuid()
      const defaultFamilyId = FakerFunc.uuid()
      const defaultMenuId = FakerFunc.uuid()

      //  fct:
      console.log('fct')
      const fctDat = await fireFunc.fireGetTyped<myVal.FctItems>('dri', currentDriId)
      if (fctDat) {
        this.setFct(fctDat)
        this.setAppUser([
          // appUserにfctIdを記録しておく必要がある
          {
            ...this.appUser,
            currentDataSet: {
              ...this.appUser.currentDataSet,
              fct: currentFctId
            }
          }
        ])
      } else {
        throw new Error('no FCT data available in fireStore')
      }

      //  dri:
      console.log('dri')
      const driDat = await fireFunc.fireGetTyped<myVal.DriItems>('dri', currentDriId)
      if (driDat) {
        this.setDri(driDat)
        this.setAppUser([
          // appUserにdriIdを記録しておく必要がある
          {
            ...this.appUser,
            currentDataSet: {
              ...this.appUser.currentDataSet,
              dri: currentDriId
            }
          }
        ])
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
    },

    async fireSetFct(fctId: string, val: myVal.FctItemsWithNote) {
      await fireFunc.fireSetMergeTyped<myVal.FctItemsWithNote>('fct', fctId, val)
    },

    async fireSetDri(driId: string, val: myVal.DriItemsWithNote) {
      await fireFunc.fireSetMergeTyped<myVal.DriItemsWithNote>('dri', driId, val)
    },

    async fireSetAppUser(userId: string, val: myVal.AppUser) {
      await fireFunc.fireSetMergeTyped<myVal.AppUser>('user', userId, val)
    }
  }
})
