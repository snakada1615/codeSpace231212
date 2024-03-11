// import { defineStore } from 'pinia'

// import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as myVal from '@/models/myTypes'
import { fireFunc } from '@/models/fireFunctions'
import FakerFunc from '@/models/fakerFunc'
import { Dialog, Notify } from 'quasar'
import { fakerFA } from '@faker-js/faker'

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
    // NOTE updateStateValue: storeに値をセット（fireUpdateStateValueを組み合わせて使う）
    updateStateValue<K extends keyof myVal.PiniaState>(fieldName: K, value: myVal.PiniaState[K]) {
      // Since this refers to the store instance, we cast it to StateKeys & this
      // const currentStateValue = (this as StateKeys & typeof this)[fieldName]
      if (this[fieldName] !== value) {
        ;(this as any)[fieldName] = value

        // 更新した要素めいが配列に蓄積される
        if (!this.modifiedStates.includes(fieldName as string)) {
          this.modifiedStates.push(fieldName as string)
        }
      }
    },

    // NOTE fireUpdateStateValue: fireStoreに値をセットしてmodifiedStatesをクリア
    async fireUpdateStateValue(collectionName: string, docId: string) {
      // Ensure updates object respects the state structure
      const updates: Partial<Record<keyof myVal.PiniaState, StateValue>> = {}

      for (const fieldName of this.modifiedStates) {
        updates[fieldName as keyof myVal.PiniaState] = this[fieldName as keyof myVal.PiniaState]
      }

      console.log('updates...')
      console.log(updates)

      // Your Firestore document reference, now with a converter applied
      // const documentRef = doc(/* firestore instance */, /* path */).withConverter(yourStoreConverter);
      // await updateDoc(documentRef, updates);
      await fireFunc.fireSetMergeTyped<myVal.PiniaState_partial>(
        collectionName,
        docId,
        updates as myVal.PiniaState_partial
      )

      this.modifiedStates = []
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

    // NOTE fireGetUserData: userが変わるたびに初期化
    async fireGetUserData(userId: string) {
      try {
        const res = await fireFunc.fireGetTyped<myVal.PiniaState>('user', userId)
        if (res) {
          console.log('fireGetUserData: fetch success')
          this.appUser = res.appUser
          this.projectInfo = res.projectInfo
          this.fct = res.fct
          this.dri = res.dri
          this.house = res.house
          this.menu = res.menu
          this.currentDataSet = res.currentDataSet
          this.loading = res.loading
          this.copyDataFromOrigin = res.copyDataFromOrigin
          this.isUpdate = res.isUpdate
          this.modifiedStates = res.modifiedStates
        } else {
          console.log('fireGetUserData: fetch fail')
          const newFctId = FakerFunc.uuid()
          const newDriId = FakerFunc.uuid()

          // オリジナルのFCTをコピーして複製
          const newFct = (await this.fireGetDefaultFromFireStore<myVal.FctItems>(
            'fct',
            'user',
            newFctId,
            userId
          )) as myVal.FctItemsWithNote

          // オリジナルのDRIをコピーして複製
          const newDri = (await this.fireGetDefaultFromFireStore<myVal.FctItems>(
            'dri',
            'user',
            newDriId,
            userId
          )) as myVal.DriItemsWithNote

          // オリジナルが見つからなければエラーを出して終了
          if (!newFct || !newDri) {
            throw new Error('no original data for fct/dri')
          }

          this.appUser = { ...myVal.appUserDefault, user: userId }
          this.projectInfo = { ...myVal.projectInfoDefault, user: userId }
          this.fct = newFct
          this.dri = newDri
          this.house = myVal.housesDefault
          this.menu = myVal.menuesDefault
          this.currentDataSet = myVal.currentDataSetDefault
          this.loading = false
          this.modifiedStates = []
        }
        console.log(res)
      } catch (error) {
        throw new Error('error')
      }
      return true
    },

    // NOTE fireGetAllData: ログイン状態が変わるたびに初期化
    async fireGetAllData(userId: string) {
      console.error('ここから入る')
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

    // NOTE fireInitialize: userデータの一括初期化関数 ---------------------------------------------------------------------------
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

    // NOTE fireGetData: userデータをfireStoreから入手してpiniaに保存 ---------------------------------------------------------------------------
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

    // NOTE fireSetDefault: userデータがfireStoreに存在しなかった場合の初期化関数 ---------------------------------------------------------------------------
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

    // NOTE fireGetDefaultFromFireStore: userデータがfireStoreに存在しなかった場合の初期化関数 ---------------------------------------------------------------------------
    async fireGetDefaultFromFireStore<T>(
      originCollection: 'fct' | 'dri',
      destCollection: string,
      newId: string, // 初期化データ保存用のID
      userId: string // 利用中のユーザーID
    ) {
      // まずはoriginal Fctをコピーして複製
      const copiedData = await fireFunc.fireDuplicateDocument(
        originCollection,
        this.copyDataFromOrigin[originCollection],
        destCollection,
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

        Notify.create({
          position: 'top-right',
          message: `${originCollection} initialized with default value`,
          timeout: 3000
        })

        return resultData
      } else {
        console.error(`no ${originCollection.toUpperCase()} data available in fireStore`)
        return null
      }
    },

    // NOTE fireSetDefaultFromFireStore: userデータがfireStoreに存在しなかった場合の初期化関数 ---------------------------------------------------------------------------
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
