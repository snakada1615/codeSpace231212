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
    projectInfos: [myVal.projectInfoDefault],
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
    stateUserId: (state) => {
      return state.appUser.userId
    },
    stateUserInfo: (state) => {
      return state.appUser.country.length > 0 && state.appUser.name.length > 0
    }
    // stateProjectInfo: (state) => {
    //   return state.projectInfos.find()
    // }
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
    setProjectInfos(val: myVal.ProjectInfos) {
      this.projectInfos = val
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
      console.log('fireGetFct')
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
      console.log('fireGetAppUser')
      const driDat = await fireFunc.fireGetTyped<myVal.DriItems>('dri', currentFctId)
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
        (projectInfo) => this.setProjectInfos(projectInfo),
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
            menuItemId: defaultMenuId
          }
        ]
      )

      // // await this.fireGetAppUser(userId)
      // console.log('fireGetProject')
      // await this.fireGetProject(userId)
      // console.log('fireGetDri')

      // // await this.fireGetHouse(userId)
      // console.log('fireGetMenu')
      // await this.fireGetMenu(userId)
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

    // async fireGetAppUser(projectId: string) {
    //   const res = await fireFunc.fireGetQueryTyped<myVal.AppUser>('user', 'projectId', projectId)
    //   if (res) {
    //     this.setAppUser(res[0])
    //   } else {
    //     console.log('AppUser data not available in server. initializa data...')
    //     this.setAppUser(myVal.appUserDefault)
    //   }
    // },

    // async fireGetHouse(projectId: string) {
    //   const res = await fireFunc.fireGetQueryTyped<myVal.House>('house', 'projectId', projectId)
    //   if (res) {
    //     this.setHouses(res)
    //   } else {
    //     this.setHouses([myVal.houseDefault])
    //   }
    // },

    // async fireGetMenu(projectId: string) {
    //   const res = await fireFunc.fireGetQueryTyped<myVal.MenuItem>('menu', 'projectId', projectId)
    //   if (res) {
    //     this.setMenu(res)
    //   } else {
    //     this.setMenu([{ ...myVal.menuItemDefault, projectId: myVal.projectInfoDefault.projectId }])
    //   }
    // },

    // async fireGetProject(userId: string) {
    //   const res = await fireFunc.fireGetQueryTyped<myVal.ProjectInfo>(
    //     'projectInfos',
    //     'userId',
    //     userId
    //   )
    //   if (res) {
    //     this.setProjectInfos(res)
    //   } else {
    //     console.log('ProjectInfo data not available in server. initializa data...')
    //     this.setProjectInfos([myVal.projectInfoDefault])
    //   }
    // },

    // async getDataFire(userId: string, dataType: 'fct' | 'dri', typedValue: any) {
    //   const itemId = this.appUser.currentDataSet[dataType]
    //   if (!itemId) {
    //     console.log(`${dataType.toUpperCase()} data not available in server. Initializing data...`)
    //     await this.initializeFireData(userId, dataType)
    //     return
    //   }

    //   const res = await fireFunc.fireGetTyped<typeof typedValue>(dataType, itemId)
    //   if (res) {
    //     switch (dataType.toUpperCase()) {
    //       case 'FCT':
    //         this.setFct(res.data)
    //         break
    //       case 'DRI':
    //         this.setDri(res.data)
    //         break
    //       default:
    //         return
    //     }
    //   } else {
    //     console.log(`${dataType.toUpperCase()} data not available in server. Initializing data...`)
    //     await this.initializeFireData(userId, dataType)
    //   }
    // },

    // async initializeFireData(userId: string, dataType: 'fct' | 'dri') {
    //   // const defaultId = this.appUser.currentDataSet[`${dataType}Default`]
    //   const defaultId = dataType === 'fct' ? this.fctDefault : this.driDefault
    //   const res = await fireFunc.fireGetTyped<any>(dataType, defaultId)
    //   if (!res) {
    //     throw new Error(
    //       `no ${dataType.toUpperCase()} data in firebase @mainStore/fireGet${dataType.toUpperCase()}`
    //     )
    //   }

    //   switch (dataType.toUpperCase()) {
    //     case 'FCT':
    //       this.setFct(res.data)
    //       break
    //     case 'DRI':
    //       this.setDri(res.data)
    //       break
    //     default:
    //       return
    //   }

    //   const newId = FakerFunc.uuid()
    //   switch (dataType.toUpperCase()) {
    //     case 'FCT':
    //       this.fireSetFct(newId, {
    //         data: res,
    //         note: '',
    //         userId: userId
    //       })
    //       break
    //     case 'DRI':
    //       this.fireSetDri(newId, {
    //         data: res,
    //         note: '',
    //         userId: userId
    //       })
    //       break
    //     default:
    //       return
    //   }

    //   // Update appUser
    //   const newAppUser: myVal.AppUser = {
    //     ...this.appUser,
    //     currentDataSet: {
    //       ...this.appUser.currentDataSet,
    //       [dataType]: newId
    //     }
    //   }
    //   this.setAppUser([newAppUser])
    //   await this.fireSetAppUser(this.appUser.userId, newAppUser)
    // },

    // Usage:
    // For FCT:
    // await this.getData(userId, 'fct', myVal.FctItemsWithNote);

    // For DRI:
    // await this.getData(userId, 'dri', myVal.DriItemsWithNote);

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
