// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/myTypes'
import { fireFunc } from '@/models/fireFunctions'
import FakerFunc from '@/models/fakerFunc'
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

interface PiniaState {
  // 現在利用しているユーザーの情報
  appUser: myVal.AppUser
  // ユーザーが取り組んでいるプロジェクトの情報
  projectInfo: myVal.ProjectInfo | myVal.ProjectInfoBlank
  fct: myVal.FctItems | null
  dri: myVal.DriItems | null
  // プロジェクトで対象とする家庭の情報
  house: myVal.Houses | myVal.HousesBlank
  // 各家庭での食事調査結果
  menu: myVal.Menu | myVal.MenuItemsBlank | null
  // デフォルトで使うデータベース名
  currentDataSet: myVal.CurrentDataSet | myVal.CurrentDataSetBlank
  // loading時のsplash画面表示
  loading: boolean
  copyDataFromOrigin: { fct: string; dri: string }
  isUpdate: boolean
  modifiedStates: string[]
}

export const useProjectData = defineStore('prjData', {
  state: (): PiniaState => ({
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
    modifiedStates: []
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

    // stateHouseInfo(state) {
    //   if (!state.houses) {
    //     return false
    //   }
    //   if (state.houses.length <= 0) {
    //     return false
    //   }
    //   console.log(state.houses)
    //   const currentHouse = state.houses.find((item) => item.familyId === state.currentDataSet.house)
    //   if (!currentHouse) {
    //     return false
    //   }
    //   if (!myVal.HouseZod.safeParse(currentHouse)) {
    //     return false
    //   }
    //   if (currentHouse.familyMembers.reduce((accum, current) => current.count + accum, 0) <= 0) {
    //     return false
    //   }
    //   return true
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
    // TODO storeに値をセット
    updateStateValue<K extends keyof PiniaState>(fieldName: K, value: PiniaState[K]) {
      // Since this refers to the store instance, we cast it to StateKeys & this
      // const currentStateValue = (this as StateKeys & typeof this)[fieldName]
      if (this[fieldName] !== value) {
        ;(this as any)[fieldName] = value

        // Assuming modifiedStates is part of the state and typed correctly
        if (!this.modifiedStates.includes(fieldName as string)) {
          this.modifiedStates.push(fieldName as string)
        }
      }
    },

    // NOTE fireResetData: userIdに紐づいたデータの削除、初期化
    async fireResetData(userId: string) {
      try {
        await fireFunc.fireDeleteQueryDoc('currentDataSet', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('dri', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('fct', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('projectInfo', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('menu', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('house', 'user', userId)
        await fireFunc.fireDeleteQueryDoc('user', 'user', userId)
        console.log('all data cleared')
        console.log('initialize all data for ' + userId)
        this.fireGetAllData(userId)
      } catch (error) {
        console.log(error)
      }
    },

    // NOTE ログイン状態が変わるたびに初期化
    async fireGetAllData(userId: string) {
      this.updateStateValue('appUser', { ...this.appUser, user: userId })
      const defaultFamilyId: string = FakerFunc.uuid()
      const defaultFctId = FakerFunc.uuid()
      const defaultDriId = FakerFunc.uuid()
      const defaultMenuId = FakerFunc.uuid()
      const defaultProjectId = FakerFunc.uuid()
      const defaultCurrentDataSetrId = FakerFunc.uuid()

      // AppUser:
      console.log('...fetching appUser')
      await this.fireInitialize<myVal.AppUser>(
        'user', // collection名
        'user', // 参照用フィールド
        userId, // 参照値
        // (userData) => this.setAppUser(userData[0]), //piniaに値をセットする関数
        (userData) => this.updateStateValue('appUser', userData[0]), //piniaに値をセットする関数
        {
          ...myVal.appUserDefault,
          user: userId
        }, // データがない場合の初期値
        userId, // userid
        this.currentDataSet, // 現状記録
        userId // データがfireStoreに存在しない場合、このIDで新規作成
      )

      // currentDataSet
      console.log('...fetching currentDataSet')
      await this.fireInitialize<myVal.CurrentDataSet>(
        'currentDataSet', // collection名
        'user', // 参照用フィールド
        userId, // 参照値
        // (userData) => this.setCurrentDataset(userData[0]), //piniaに値をセットする関数
        (userData) =>
          this.updateStateValue('currentDataSet', JSON.parse(JSON.stringify(userData[0]))), //piniaに値をセットする関数
        {
          ...this.currentDataSet,
          user: userId,
          currentDataSet: defaultCurrentDataSetrId
        }, // データがない場合の初期値
        userId,
        this.currentDataSet,
        defaultCurrentDataSetrId // データがfireStoreに存在しない場合、このIDで新規作成
      )

      // fct:
      console.log('...fetching fct')
      await this.fireInitialize<myVal.FctItemsWithNote>(
        'fct', // collection名
        'fct', // 参照用フィールド
        this.currentDataSet.fct, // 参照値
        // (userData) => this.setFct(userData[0].data), //piniaに値をセットする関数
        (userData) => this.updateStateValue('fct', JSON.parse(JSON.stringify(userData[0].data))), //piniaに値をセットする関数
        { ...myVal.fctItemsWIthNoteDefault, user: userId, fct: defaultFctId }, // データがない場合の初期値
        userId,
        this.currentDataSet,
        defaultFctId // データがfireStoreに存在しない場合、このIDで新規作成
      )

      //  dri:
      console.log('...fetching dri')
      await this.fireInitialize<myVal.DriItemsWithNote>(
        'dri', // collection名
        'dri', // 参照用フィールド
        this.currentDataSet.dri, // 参照値
        // (userData) => this.setDri(userData[0].data), //piniaに値をセットする関数
        (userData) => this.updateStateValue('dri', JSON.parse(JSON.stringify(userData[0].data))),
        { ...myVal.driItemsWIthNoteDefault, user: userId, dri: defaultDriId }, // データがない場合の初期値
        userId,
        this.currentDataSet,
        defaultDriId // データがfireStoreに存在しない場合、このIDで新規作成
      )

      // Project
      console.log('...fetching project data')
      await this.fireInitialize<myVal.ProjectInfo>(
        'projectInfo', // collection名
        'projectIndo', // 参照用フィールド
        this.currentDataSet.projectInfo, // 参照値
        // (houseData) => this.setHouses(houseData), //piniaに値をセットする関数
        (project) => this.updateStateValue('projectInfo', JSON.parse(JSON.stringify(project))), //piniaに値をセットする関数
        {
          ...myVal.projectInfoDefault,
          user: userId,
          projectInfo: defaultProjectId
        }, // データがない場合の初期値
        userId, // userid
        this.currentDataSet, // 現状記録
        defaultProjectId // データがfireStoreに存在しない場合、このIDで新規作成
      )

      // House:
      console.log('...fetching house data')
      await this.fireInitialize<myVal.House>(
        'house', // collection名
        'user', // 参照用フィールド
        userId, // 参照値
        // (houseData) => this.setHouses(houseData), //piniaに値をセットする関数
        (houseData) => this.updateStateValue('house', JSON.parse(JSON.stringify(houseData))), //piniaに値をセットする関数
        {
          ...myVal.houseDefault,
          user: userId,
          projectInfo: defaultProjectId,
          house: defaultFamilyId
        }, // データがない場合の初期値
        userId, // userid
        this.currentDataSet, // 現状記録
        defaultFamilyId // データがfireStoreに存在しない場合、このIDで新規作成
      )

      //  Menu:
      console.log('...fetching menu data')
      await this.fireInitialize<myVal.Menu>(
        'menu', // collection名
        'user', // 参照用フィールド
        userId, // 参照値
        // (menu) => this.setMenu(menu[0].data), //piniaに値をセットする関数
        (menu) => this.updateStateValue('menu', JSON.parse(JSON.stringify(menu))), //piniaに値をセットする関数
        {
          ...myVal.menuDefault,
          user: userId,
          projectInfo: defaultProjectId,
          house: defaultFamilyId,
          menu: defaultMenuId
        }, // データがない場合の初期値
        userId, // userid
        this.currentDataSet, // 現状記録
        defaultMenuId // データがfireStoreに存在しない場合、このIDで新規作成
      )
    },

    // NOTE userデータの一括初期化関数 ---------------------------------------------------------------------------
    async fireInitialize<T>(
      collectionName: myVal.collectionNameType,
      fieldName: string,
      fieldValue: string,
      setFunction: (data: T[]) => void,
      defaultData: T,
      userId: string,
      myCurrentDataSet: myVal.CurrentDataSet,
      newId?: string
    ) {
      // fireStoreからデータをfetchしてPiniaに保存
      const resultFetch = await this.fireGetData<T>(
        collectionName,
        fieldName,
        fieldValue,
        setFunction
      )

      // うまくfetchできたらこれで終了
      if (resultFetch.result) {
        console.log(`data successfully downloaded from ${collectionName}`)
        Notify.create({
          position: 'top-right',
          message: `data successfully downloaded from ${collectionName}`,
          timeout: 3000
        })
        return true
      }

      console.log(`failed fetching data..., set initial value for ${collectionName}`)
      switch (collectionName) {
        case 'fct':
          if (newId) {
            return await this.fireSetDefaultFromFireStore<T>(
              'fct',
              newId,
              userId,
              // this.setFct,
              (userData) => this.updateStateValue('fct', JSON.parse(JSON.stringify(userData))),
              myCurrentDataSet
            )
          } else {
            throw new Error('missing parameter, newId in fireGetData')
          }
          break

        case 'dri':
          if (newId) {
            return await this.fireSetDefaultFromFireStore<T>(
              'dri',
              newId,
              userId,
              // this.setDri,
              (userData) => this.updateStateValue('dri', JSON.parse(JSON.stringify(userData))),
              myCurrentDataSet
            )
          } else {
            throw new Error('missing parameter, newId in fireGetData')
          }
          break

        case 'currentDataSet':
          if (newId) {
            await this.fireSetDefault<T>(
              collectionName,
              newId,
              userId,
              defaultData as T,
              myCurrentDataSet,
              // (val) => this.setCurrentDataset(val as myVal.CurrentDataSet)
              (val) => this.updateStateValue('currentDataSet', JSON.parse(JSON.stringify(val))) //piniaに値をセットする関数
            )
          } else {
            throw new Error('missing parameter, newId in fireGetData')
          }
          break

        case 'user':
          if (newId) {
            await this.fireSetDefault<T>(
              collectionName,
              newId,
              userId,
              defaultData as T,
              myCurrentDataSet,
              // (val) => this.setAppUser(val as myVal.AppUser)
              (val) => this.updateStateValue('appUser', val as myVal.AppUser) //piniaに値をセットする関数
            )
          } else {
            throw new Error('missing parameter, newId in fireGetData')
          }
          break

        case 'projectInfo':
          if (newId) {
            await this.fireSetDefault<T>(
              collectionName as myVal.fireDocNames,
              newId,
              userId,
              defaultData as T,
              myCurrentDataSet,
              // (val) => this.setCurrentDataset(val as myVal.CurrentDataSet)
              (val) => this.updateStateValue('projectInfo', JSON.parse(JSON.stringify(val))) //piniaに値をセットする関数
            )
          } else {
            throw new Error('missing parameter, newId in fireGetData')
          }
          break

        case 'house':
          if (newId) {
            try {
              await this.fireSetDefault<T>(
                collectionName as myVal.fireDocNames,
                newId,
                userId,
                defaultData as T,
                myCurrentDataSet,
                // (val) => this.setCurrentDataset(val as myVal.CurrentDataSet)
                (val) => this.updateStateValue('house', JSON.parse(JSON.stringify(val))) //piniaに値をセットする関数
              )
            } catch (error) {
              console.error(error)
            }
          } else {
            console.log(defaultData)
            console.log(myVal.HouseZod.safeParse(defaultData).success)
            throw new Error('missing parameter, newId in fireGetData')
          }
          break

        case 'menu':
          if (newId) {
            await this.fireSetDefault<T>(
              collectionName as myVal.fireDocNames,
              newId,
              userId,
              defaultData as T,
              myCurrentDataSet,
              // (val) => this.setCurrentDataset(val as myVal.CurrentDataSet)
              (val) => this.updateStateValue('menu', JSON.parse(JSON.stringify(val))) //piniaに値をセットする関数
            )
          } else {
            throw new Error('missing parameter, newId in fireGetData')
          }
          break
      }
    },

    // NOTE userデータをfireStoreから入手してpiniaに保存 ---------------------------------------------------------------------------
    async fireGetData<T>(
      collectionName: myVal.collectionNameType,
      fieldName: string,
      fieldValue: string,
      setFunction: (data: T[]) => void
    ) {
      const res = await fireFunc.fireGetQueryTyped<T>(collectionName, fieldName, fieldValue)

      if (res && res.length > 0) {
        // fireStoreにデータが保存されている場合
        setFunction(res)
        console.log(collectionName + ' fetch success!')
        return { result: true, info: collectionName }
      } else {
        return { result: false, info: 'fireGetData: no data available' }
      }
    },

    // NOTE userデータがfireStoreに存在しなかった場合の初期化関数 ---------------------------------------------------------------------------
    async fireSetDefault<T>(
      collectionName: myVal.collectionNameType, // 保存先のcollection
      newId: string, // 初期化データ保存用のID
      userId: string, // 利用中のユーザーID
      defaultData: T, // 初期化用のデータ
      myCurrentDataSet: myVal.CurrentDataSet, // currentDataSetの値（これを更新して保存する）
      setFunction: (data: T) => void // piniaを更新するための関数指定
    ) {
      // fireStoreに保存
      const res = await fireFunc.fireSetTyped<T>(collectionName, newId, defaultData)
      if (!res.flag) {
        console.error(res.value)
      }

      // piniaに保存
      setFunction(defaultData)

      // currentDataSetを更新
      const resCurr = {
        ...myCurrentDataSet,
        user: userId,
        [collectionName]: newId
      } as myVal.CurrentDataSet

      // this.setCurrentDataset(resCurr as myVal.CurrentDataSet) // currentDataSetの更新
      this.updateStateValue('currentDataSet', JSON.parse(JSON.stringify(resCurr))) // currentDataSetの更新
      await fireFunc.fireSetMergeTyped<myVal.CurrentDataSet>(
        // fireStoreに保存--currentDataSet
        'currentDataSet',
        myCurrentDataSet.currentDataSet,
        resCurr,
        'copying data...'
      )
      // console.error(`resCurr: ${collectionName}`)
      // console.error(resCurr)
      Notify.create({
        position: 'top-right',
        message: `${collectionName} initialized with default value`,
        timeout: 3000
      })
    },

    // NOTE userデータがfireStoreに存在しなかった場合の初期化関数 ---------------------------------------------------------------------------
    async fireSetDefaultFromFireStore<T>(
      originCollection: 'fct' | 'dri',
      newId: string, // 初期化データ保存用のID
      userId: string, // 利用中のユーザーID
      setData: (data: any) => void, // piniaを更新するための関数指定
      myCurrentDataSet: myVal.CurrentDataSet // currentDataSetの値（これを更新して保存する）
    ) {
      // まずはoriginal Fctをコピーして複製
      const copiedData = await fireFunc.fireDuplicateDocument(
        originCollection,
        this.copyDataFromOrigin[originCollection],
        originCollection,
        newId,
        `data not found. Downloading default data from fireStore...`
      )
      // console.log(copiedData)
      if (copiedData) {
        // コピーしたデータ（driItemWithNote）の一部を修正して、firesotre, piniaに保存、currentDataSetの修正
        // まずはデータ準備
        const resultData = {
          data: copiedData.data.data,
          user: userId,
          [originCollection]: newId,
          note: ''
        }
        const resCurr = {
          ...myCurrentDataSet,
          user: userId,
          [originCollection]: newId
        }

        // console.error(`resCurr:  ${originCollection}`)
        // console.error(resCurr)
        // console.error(resultData)
        // fireStoreに保存
        await fireFunc.fireSetTyped<T>(originCollection, newId, resultData as T)

        // piniaに保存
        setData(copiedData.data.data) // piniaに保存(修正してなくて良い)

        // currentDataSetに保存
        // this.setCurrentDataset(resCurr as myVal.CurrentDataSet) // currentDataSetの更新
        this.updateStateValue('currentDataSet', JSON.parse(JSON.stringify(resCurr))) // currentDataSetの更新
        await fireFunc.fireSetMergeTyped<myVal.CurrentDataSet>(
          // fireStoreに保存--currentDataSet
          'currentDataSet',
          myCurrentDataSet.currentDataSet,
          resCurr as myVal.CurrentDataSet,
          'copying data...'
        )

        Notify.create({
          position: 'top-right',
          message: `${originCollection} initialized with default value`,
          timeout: 3000
        })

        return true
      } else {
        console.error(`no ${originCollection.toUpperCase()} data available in fireStore`)
        return false
      }
    }
  }
})
