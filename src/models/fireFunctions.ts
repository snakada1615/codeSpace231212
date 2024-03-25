// import { useRouter } from 'vue-router'
// import { onBeforeUnmount } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, type User } from 'firebase/auth'
import {
  getFirestore,
  type FirestoreDataConverter,
  type WithFieldValue,
  DocumentReference
} from 'firebase/firestore'
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  QueryDocumentSnapshot,
  type DocumentData
} from 'firebase/firestore'
import { Loading } from 'quasar'
import * as myVal from '@/models/myTypes'
import type { CollectionReference } from 'firebase/firestore/lite'
import { ZodSchema } from 'zod'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCeFvsKeAZAVOv-Y3_5YpIt1iz5nLFeslc',
  authDomain: 'ifnanfaapp101.firebaseapp.com',
  projectId: 'ifnanfaapp101',
  storageBucket: 'ifnanfaapp101.appspot.com',
  messagingSenderId: '1024877003239',
  appId: '1:1024877003239:web:bb25aeee1a9216ed7f3d42',
  measurementId: 'G-QD44RZTNSD'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

function splash(val: boolean, mes?: string) {
  if (val) {
    Loading.show({
      message: mes || 'Accessing remote database. Please wait...',
      //      boxClass: 'bg-grey-2 text-grey-9',
      spinnerColor: 'primary'
    }) //splash
  } else {
    Loading.hide()
  }
}

interface ConverterMap {
  [key: string]: FirestoreDataConverter<any>
  fct: FirestoreDataConverter<myVal.FctItemsWithNote>
  dri: FirestoreDataConverter<myVal.DriItemsWithNote>
  user: FirestoreDataConverter<myVal.User>
  projectInfo: FirestoreDataConverter<myVal.ProjectInfo>
  house: FirestoreDataConverter<myVal.House>
  menu: FirestoreDataConverter<myVal.Menu>
  currentDataSet: FirestoreDataConverter<myVal.CurrentDataSet>
  // other specific converters
}

export class fireFunc {
  // ここからwithConverter更新版 --------------------------------------------
  private static converter = <T>(
    isOfTypeT: (data: any) => data is T
  ): FirestoreDataConverter<T> => ({
    toFirestore: (data: WithFieldValue<T>): WithFieldValue<DocumentData> => {
      if (!isOfTypeT(data)) {
        console.log('isOffType Error')
        console.log(data)
        throw new Error('Provided data does not match expected type.')
      }
      // The data object has been validated and can be spread into the resulting object
      return { ...data } as WithFieldValue<DocumentData>
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
      const data = snapshot.data()
      if (!isOfTypeT(data)) {
        console.log('isOffType Error')
        console.log(data)
        throw new Error('Data from Firestore does not match expected type.')
      }
      return data
    }
  })
  // 基本となるvaridator
  private static createIsOfTypeT = <T>(schema: ZodSchema<T>): ((data: any) => data is T) => {
    return (data: any): data is T => {
      const res = schema.safeParse(data)
      if (res.success) {
        return true
      } else {
        console.error(res.error)
        return false
      }
    }
  }

  // Create type guards using their respective Zod schemas
  private static isFctItem = this.createIsOfTypeT<myVal.FctItemsWithNote>(myVal.FctItemsWithNoteZod)
  private static isDriItem = this.createIsOfTypeT<myVal.DriItemsWithNote>(myVal.DriItemsWithNoteZod)
  private static isUser = this.createIsOfTypeT<myVal.User>(myVal.UserZod)
  private static isProjectInfo = this.createIsOfTypeT<myVal.ProjectInfo>(myVal.ProjectInfoZod)
  private static isHouse = this.createIsOfTypeT<myVal.House>(myVal.HouseZod)
  private static isMenu = this.createIsOfTypeT<myVal.Menu>(myVal.MenuZod)
  private static isCurrentDataSet = this.createIsOfTypeT<myVal.CurrentDataSet>(
    myVal.CurrentDataSetZod
  )
  private static isPiniaStatePartial = this.createIsOfTypeT<myVal.PiniaState_partial>(
    myVal.PiniaState_partialZod
  )
  private static isPiniaState = this.createIsOfTypeT<myVal.PiniaState>(myVal.PiniaStateZod)
  private static isPiniaStateForFire = this.createIsOfTypeT<myVal.PiniaStateForFire>(myVal.PiniaStateForFireZod)

  // Then use these type guards within your converter instantiation
  private static fctItemConverter = this.converter<myVal.FctItemsWithNote>(this.isFctItem)
  private static driItemConverter = this.converter<myVal.DriItemsWithNote>(this.isDriItem)
  private static userConverter = this.converter<myVal.User>(this.isUser)
  private static ProjectInfoConverter = this.converter<myVal.ProjectInfo>(this.isProjectInfo)
  private static houseConverter = this.converter<myVal.House>(this.isHouse)
  private static menuConverter = this.converter<myVal.Menu>(this.isMenu)
  private static currentDataSetConverter = this.converter<myVal.CurrentDataSet>(
    this.isCurrentDataSet
  )
  private static piniaStatePartialConverter = this.converter<myVal.PiniaState_partial>(
    this.isPiniaStatePartial
  )
  private static piniaStateConverter = this.converter<myVal.PiniaState>(this.isPiniaState)
  private static piniaStateForFireConverter = this.converter<myVal.PiniaStateForFire>(this.isPiniaStateForFire)

  private static converters: ConverterMap = {
    fct: this.fctItemConverter,
    dri: this.driItemConverter,
    user: this.userConverter,
    projectInfo: this.ProjectInfoConverter,
    house: this.houseConverter,
    menu: this.menuConverter,
    currentDataSet: this.currentDataSetConverter,
    piniaStatePartial: this.piniaStatePartialConverter,
    piniaState: this.piniaStateConverter,
    piniaStateForFire: this.piniaStateForFireConverter
    // More converters can be added here
  }

  // Adjust the getTypeConverter method signature to take a key of ConverterTypeMap rather than a generic type
  private static getTypeConverter<K extends keyof myVal.ConverterTypeMap>(
    collectionId: K
  ): FirestoreDataConverter<myVal.ConverterTypeMap[K]> {
    const converter = this.converters[collectionId]
    if (!converter) {
      throw new Error(`Converter for collection "${collectionId}" is not found.`)
    }
    return converter as FirestoreDataConverter<myVal.ConverterTypeMap[K]>
  }

  // ここまでwithConverter更新版 --------------------------------------------

  static async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }

  static logOut() {
    auth.signOut()
  }

  static async fireGet(collectionId: string, docId: string) {
    const docRef = doc(db, collectionId, docId)
    try {
      splash(true) // splash
      const snapshot = await getDoc(docRef)
      splash(false)
      if (snapshot.exists()) {
        return snapshot.data()
      } else {
        return null
      }
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  // TODO 要修正（AllProjectDataの使い方）
  static async fireGetQuery(collectionId: string, key: string, val: string) {
    splash(true)
    const colRef: CollectionReference = collection(db, collectionId)

    const q = query(colRef, where(key, '==', val))
    try {
      const snapshot = await getDocs(q)
      splash(false)
      const res: Array<myVal.AllProjectData> = []
      snapshot.forEach((doc) => {
        const docData = doc.data() as myVal.AllProjectData // type assertion...
        res.push(docData)
      })
      return res
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireSet(collectionId: string, docId: string, val: object) {
    splash(true)
    try {
      await setDoc(doc(db, collectionId, docId), val)
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireSetMerge(collectionId: string, docId: string, val: object) {
    splash(true)
    try {
      await setDoc(doc(db, collectionId, docId), val, { merge: true })
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireDeleteDoc(collectionId: string, docId: string, message?: string) {
    try {
      splash(true, message || 'deleting data...')
      await deleteDoc(doc(db, collectionId, docId))
      splash(false)
    } catch (error) {
      splash(false)
      throw new Error('fireDeleteDoc Error:' + error)
    }
  }

  static async fireDeleteQueryDoc(
    collectionId: string,
    field: string,
    fieldValue: string,
    message?: string
  ) {
    const colRef: CollectionReference = collection(db, collectionId)
    const q = query(colRef, where(field, '==', fieldValue))
    try {
      splash(true, message || 'deleting data...')
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        console.log(`document did not found: fireDeleteQueryDoc - ${collectionId}`)
        splash(false)
        return null
      }

      for (const docData of snapshot.docs) {
        // Now we have a DocumentReference
        const docRef = doc(db, collectionId, docData.id)
        await deleteDoc(docRef)
        splash(false)
      }
    } catch (error) {
      splash(false)
      throw new Error('fireDeleteQueryDoc Error:' + error)
    }
  }

  static async fireDuplicateDocument(
    sourceCol: string,
    sourceDoc: string,
    targetCol: string,
    targetDoc: string,
    message?: string
  ) {
    const sourcePath = sourceCol + '/' + sourceDoc
    const targetPath = targetCol + '/' + targetDoc
    splash(true, message || `copying from ${sourcePath} to ${targetPath}`)
    try {
      // Reference the source document
      const sourceDocRef = doc(db, sourcePath)

      // Get the source document
      const sourceDocSnapshot = await getDoc(sourceDocRef)

      // Ensure the document exists
      if (!sourceDocSnapshot.exists()) {
        console.log('Source document does not exist')
        return null
      }

      // Retrieve the data from the source document
      const sourceData = sourceDocSnapshot.data()

      // Reference the target document (this will create a new document)
      const targetDocRef = doc(db, targetPath)

      // Set the data in the target document (duplicating the document)
      await setDoc(targetDocRef, sourceData)
      splash(false)
      console.log(`Document was duplicated from ${sourcePath} to ${targetPath}`)
      return {
        id: targetDoc,
        data: sourceDocSnapshot.data()
      }
    } catch (error) {
      splash(false)
      console.error('Error duplicating document:', error)
      return null
    }
  }

  static async fireGetTyped<K extends keyof myVal.ConverterTypeMap>(
    collectionId: string,
    docId: string,
    docType: K
  ): Promise<myVal.ConverterTypeMap[K] | null> {
    const converter = this.getTypeConverter(docType)
    const docRef = doc(db, collectionId, docId).withConverter(converter)

    try {
      splash(true)
      const snapshot = await getDoc(docRef)
      splash(false)
      if (snapshot.exists()) {
        return snapshot.data() as myVal.ConverterTypeMap[K]
      } else {
        return null
      }
    } catch (error) {
      splash(false)
      console.log(error)
      return null
    }
  }

  static async fireGetQueryTyped<K extends keyof myVal.ConverterTypeMap>(
    collectionId: string,
    key: string,
    val: string,
    docType: K,
    options?: { message: string }
  ): Promise<myVal.ConverterTypeMap[K][] | null> {
    const converter = this.getTypeConverter(docType)
    const colRef: CollectionReference = collection(db, collectionId)
    const q = query(colRef, where(key, '==', val)).withConverter(converter)
    try {
      splash(true, options?.message || 'downloading data ' + collectionId + '...')
      const snapshot = await getDocs(q)
      splash(false)
      const res: Array<myVal.ConverterTypeMap[K]> = []
      if (snapshot.empty) {
        return null
      }
      snapshot.forEach((doc) => {
        const docData = doc.data() as myVal.ConverterTypeMap[K]
        res.push(docData)
      })
      return res
    } catch (error) {
      splash(false)
      console.log(error)
      return null
    }
  }

  static async fireSetTyped<K extends keyof myVal.ConverterTypeMap>(
    collectionId: string,
    docId: string,
    docType: K,
    val: myVal.ConverterTypeMap[K]
  ) {
    const converter = this.getTypeConverter(docType)
    const docRef: DocumentReference = doc(db, collectionId, docId).withConverter(converter)
    try {
      splash(true)
      await setDoc(docRef, val)
      splash(false)
      return { flag: true, value: docRef.id }
    } catch (error) {
      splash(false)
      console.log(error)
      return { flag: false, value: error }
    }
  }

  static async fireSetMergeTyped<K extends keyof myVal.ConverterTypeMap>(
    collectionId: string,
    docId: string,
    docType: K,
    val: myVal.ConverterTypeMap[K],
    message?: string
  ) {
    splash(true, message || `uploading ${collectionId} data to fireStore...`)
    const converter = this.getTypeConverter(docType)
    const docRef: DocumentReference = doc(db, collectionId, docId).withConverter(converter)
    try {
      await setDoc(docRef, val, { merge: true })
      console.log('done')
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireUpdateTyped<K extends keyof myVal.ConverterTypeMap>(
    collectionId: string,
    docId: string,
    docType: K,
    val: myVal.ConverterTypeMap[K]
  ) {
    const converter = this.getTypeConverter(docType)
    const documentRef = doc(db, collectionId, docId).withConverter(converter)
    try {
      await updateDoc(documentRef, val)
    } catch (error) {
      console.log(error)
    }
  }

  static async fireSetQueryMergeTyped<K extends keyof myVal.ConverterTypeMap>(
    collectionId: string,
    key: string,
    keyVal: string,
    docType: K,
    val: myVal.ConverterTypeMap[K],
    message?: string,
    newId?: string
  ) {
    splash(true, message || `uploading ${collectionId} data to fireStore...`)
    const converter = this.getTypeConverter(docType)
    const colRef: CollectionReference = collection(db, collectionId)
    const q = query(colRef, where(key, '==', keyVal)).withConverter(converter)
    try {
      const snapshot = await getDocs(q)
      const currentVal = snapshot.docs[0]
      if (currentVal) {
        // Now we have a DocumentReference
        const docRef = doc(colRef, currentVal.id).withConverter(converter)
        await setDoc(docRef, val, { merge: true })
        console.log('done')
      } else {
        if (newId) {
          const docRef: DocumentReference = doc(db, collectionId, newId).withConverter(converter)
          await setDoc(docRef, val)
        } else {
          throw new Error('missing parameter in fireSetQUeryMergeTyped<T>. newId is missing')
        }
      }
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }
}
