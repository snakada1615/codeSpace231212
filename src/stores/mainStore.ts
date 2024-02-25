// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/myTypes'
import { fireFunc } from '@/models/fireFunctions'
import FakerFunc from '@/models/fakerFunc'
import { Dialog } from 'quasar'

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
  currentDataSet: myVal.CurrentDataSet | myVal.CurrentDataSetBlank
  // loading時のsplash画面表示
  loading: boolean
  copyDataFromOrigin: { fct: string; dri: string }
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
    currentDataSet: myVal.currentDataSetDefault,
    loading: false,
    copyDataFromOrigin: {
      fct: 'ffd78be6-b2c5-40aa-9704-50332044569c',
      dri: '5139dec2-f340-46bd-aed4-57670991bab7'
    }
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

    stateHouseInfo(state) {
      const currentHouse = state.houses.find(
        (item) => item.familyId === state.currentDataSet.family
      )
      if (!currentHouse) {
        return false
      }
      if (!myVal.HouseZod.safeParse(currentHouse)) {
        return false
      }
      if (currentHouse.familyMembers.reduce((accum, current) => current.count + accum, 0) <= 0) {
        return false
      }
      return true
    },

    // familyMembersDefault: (state) => {
    //   if (state.dri && state.dri.length > 0) {
    //     return state.dri.map((item) => {
    //       return {
    //         ...item,
    //         count: 0
    //       }
    //     })
    //   } else {
    //     return myVal.sampleFamilyMemberCategory.map((item, index) => {
    //       return {
    //         ...myVal.familyMemberDefault,
    //         DriId: String(index),
    //         Name: item
    //       }
    //     })
    //   }
    // },

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
    setUserId(val: string) {
      this.appUser.userId = val
    },
    setFct(val: myVal.FctItems) {
      this.fct = JSON.parse(JSON.stringify(val))
    },
    setDri(val: myVal.DriItems) {
      this.dri = JSON.parse(JSON.stringify(val))
    },
    setAppUser(val: myVal.AppUser) {
      this.appUser = val
    },
    setCurrentDataset(val: myVal.CurrentDataSet) {
      this.currentDataSet = JSON.parse(JSON.stringify(val))
    },
    setProjectInfo(val: myVal.ProjectInfo) {
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
    async fireSetCurrentDataset(userId: string, val: myVal.CurrentDataSet) {
      await fireFunc.fireSetQueryMergeTyped<myVal.CurrentDataSet>(
        'currentDataSet',
        'userId',
        userId,
        val,
        'CurrentDataset',
        '',
        FakerFunc.uuid()
      )
    },

    async fireSetFct(fctId: string, val: myVal.FctItemsWithNote) {
      await fireFunc.fireSetMergeTyped<myVal.FctItemsWithNote>('fct', fctId, val, 'FctItem')
    },

    async fireSetDri(driId: string, val: myVal.DriItemsWithNote) {
      await fireFunc.fireSetMergeTyped<myVal.DriItemsWithNote>('dri', driId, val, 'DriItem')
    },

    async fireSetAppUser(userId: string, val: myVal.AppUser) {
      await fireFunc.fireSetMergeTyped<myVal.AppUser>('user', userId, val, 'AppUser')
      await fireFunc.fireSetQueryMergeTyped(
        'user',
        'userId',
        userId,
        val,
        'AppUser',
        '',
        FakerFunc.uuid()
      )
    },

    async fireResetData(userId: string) {
      try {
        await fireFunc.fireDeleteQueryDoc('currentDataSet', 'userId', userId)
        await fireFunc.fireDeleteQueryDoc('dri', 'userId', userId)
        await fireFunc.fireDeleteQueryDoc('fct', 'userId', userId)
        await fireFunc.fireDeleteQueryDoc('user', 'userId', userId)
        console.log('all data cleared')
        console.log('initialize all data for ' + userId)
        this.fireGetAllData(userId)
      } catch (error) {
        console.log(error)
      }
    },

    // ログイン状態が変わるたびに実施
    async fireGetAllData(userId: string) {
      this.setUserId(userId)
      const currentProjectId = this.currentDataSet.project || FakerFunc.uuid()
      // let currentDataSetId = this.currentDataSet.currentDataSetId || FakerFunc.uuid()
      const defaultFamilyId = FakerFunc.uuid()
      const defaultMenuId = FakerFunc.uuid()

      // AppUser:
      console.log('...fetching appUser')
      await this.fireGetData<myVal.AppUser>(
        'user',
        'userId',
        userId,
        'AppUser',
        (userData) => this.setAppUser(userData[0]),
        [
          {
            ...this.appUser,
            userId: userId
          }
        ]
      )

      // currentDataSet
      console.log('...fetching currentDataSet')
      await this.fireGetData<myVal.CurrentDataSet>(
        'currentDataSet',
        'userId',
        userId,
        'CurrentDataSet',
        (userData) => this.setCurrentDataset(userData[0]),
        [
          {
            ...this.currentDataSet,
            userId: userId,
            currentDataSetId: this.currentDataSet.currentDataSetId || FakerFunc.uuid()
          }
        ]
      )
      // currentDataSetId = this.currentDataSet.currentDataSetId

      // fct:
      console.log('...fetching fct')

      await this.fireGetData<myVal.FctItemsWithNote>(
        'fct',
        'fctId',
        this.currentDataSet.fct,
        'FctItem',
        (userData) => this.setFct(userData[0].data),
        [{ data: [myVal.fctItemDefault], userId: userId, note: '', fctId: '' }],
        userId
      )

      //  dri:
      console.log('...fetching dri')
      await this.fireGetData<myVal.DriItemsWithNote>(
        'dri',
        'driId',
        this.currentDataSet.dri,
        'DriItem',
        (userData) => this.setDri(userData[0].data),
        [{ data: [myVal.driItemDefault], userId: '', note: '', driId: '' }],
        userId
      )

      // House:
      console.log('...fetching house data')
      await this.fireGetData<myVal.House>(
        'house',
        'projectId',
        currentProjectId,
        'House',
        (houseData) => this.setHouses(houseData), // houseData is already an array.
        [
          {
            ...this.houses[0],
            userId: userId,
            projectId: currentProjectId,
            familyId: defaultFamilyId
          }
        ]
      )

      //  Menu:
      console.log('...fetching menu data')
      await this.fireGetData<myVal.MenuItem>(
        'menu',
        'projectId',
        currentProjectId,
        'Menu',
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

    // 基本関数
    async fireGetData<T>(
      collectionName: string,
      fieldName: string,
      fieldValue: string,
      typeName: string,
      setFunction: (data: T[]) => void,
      defaultData: T[],
      userId?: string
    ) {
      const res = await fireFunc.fireGetQueryTyped<T>(
        collectionName,
        fieldName,
        fieldValue,
        typeName
      )

      if (res && res.length > 0) {
        setFunction(res)
        console.log(typeName + ' fetch success!')
        console.log(res)
        return { result: true, info: typeName }
      } else {
        console.log(`${collectionName} data not available in server. Initializing data...`)

        // 配列初期化のための関数(fct/dri限定)
        const initiateData = async (
          originCollection: 'fct' | 'dri',
          dataPath: string,
          setData: (data: any) => void,
          typeName: string,
          userId: string
        ) => {
          const newId = FakerFunc.uuid() // 新規ユーザのための fctId/driId 設定
          console.log(newId)
          // まずはoriginal Fctをコピーして複製
          const copiedData = await fireFunc.fireDuplicateDocument(
            originCollection,
            this.copyDataFromOrigin[originCollection],
            collectionName,
            newId,
            `${collectionName} data not found. Downloading default data from fireStore...`
          )
          console.log(copiedData)
          if (copiedData) {
            // コピーしたデータ（driItemWithNote）の一部を修正して、firesotre, piniaに保存、currentDataSetの修正
            // まずはデータ準備
            const resultData = copiedData.data.data as T
            const resCurr = { ...this.currentDataSet }
            resCurr['userId'] = userId // currentDataSetの修正
            resCurr[originCollection] = newId // currentDataSetの修正
            let resFire = {}
            switch (
              // userId/fctId/driIdの修正
              originCollection
            ) {
              case 'fct':
                resFire = {
                  data: resultData,
                  note: '',
                  userId: userId,
                  fctId: newId
                }
                await fireFunc.fireSetMergeTyped<myVal.FctItemsWithNote>(
                  // fireStoreに保存
                  collectionName,
                  newId,
                  resFire as myVal.FctItemsWithNote,
                  typeName,
                  'copying data...'
                )
                break

              case 'dri':
                resFire = {
                  data: resultData,
                  note: '',
                  userId: userId,
                  driId: newId
                }
                await fireFunc.fireSetMergeTyped<myVal.DriItemsWithNote>(
                  // fireStoreに保存
                  collectionName,
                  newId,
                  resFire as myVal.DriItemsWithNote,
                  typeName,
                  'copying data...'
                )
                break

              default:
                // resFire = {}
                break
            }

            setData(resultData) // piniaに保存(修正してなくて良い)
            this.setCurrentDataset(resCurr) // currentDataSetの更新
            await fireFunc.fireSetMergeTyped<myVal.CurrentDataSet>(
              // fireStoreに保存--currentDataSet
              'currentDataSet',
              this.currentDataSet.currentDataSetId,
              resCurr,
              'CurrentDataSet',
              'copying data...'
            )

            return {
              result: false,
              info: typeName
            }
          } else {
            throw new Error(`no ${typeName.toUpperCase()} data available in fireStore`)
          }
        }

        switch (collectionName) {
          case 'fct':
            if (userId) {
              console.log(userId)
              return initiateData(
                'fct',
                this.copyDataFromOrigin['fct'],
                this.setFct,
                typeName,
                userId
              )
            } else {
              throw new Error('missing parameter, userId in fireGetData')
            }
            break
          case 'dri':
            if (userId) {
              return initiateData(
                'dri',
                this.copyDataFromOrigin['dri'],
                this.setDri,
                typeName,
                userId
              )
            } else {
              throw new Error('missing parameter, userId in fireGetData')
            }
            break
          case 'currentDataSet':
            setFunction(defaultData)
            await fireFunc.fireSetMergeTyped<myVal.CurrentDataSet>(
              // fireStoreに保存
              'currentDataSet',
              this.currentDataSet.currentDataSetId,
              this.currentDataSet,
              'CurrentDataSet',
              'copying currentDataSet data...'
            )
            return { result: false, info: typeName }
            break
          case 'user':
            setFunction(defaultData)
            await fireFunc.fireSetMergeTyped<myVal.AppUser>(
              // fireStoreに保存
              'user',
              this.appUser.userId,
              this.appUser,
              'AppUser',
              'copying AppUser data...'
            )
            return { result: false, info: typeName }
            break
          default:
            setFunction(defaultData)
            return { result: false, info: typeName }
            break
        }
      }
    }
  }
})
