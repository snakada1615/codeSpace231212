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
      boxClass: 'bg-grey-2 text-grey-9',
      spinnerColor: 'primary'
    }) //splash
  } else {
    Loading.hide()
  }
}

interface ConverterMap {
  [key: string]: FirestoreDataConverter<any>
  FctItem: FirestoreDataConverter<myVal.FctItemsWithNote>
  DriItem: FirestoreDataConverter<myVal.DriItemsWithNote>
  AppUser: FirestoreDataConverter<myVal.AppUser>
  ProjectInfo: FirestoreDataConverter<myVal.ProjectInfo>
  House: FirestoreDataConverter<myVal.House>
  Menu: FirestoreDataConverter<myVal.Menu>
  CurrentDataSet: FirestoreDataConverter<myVal.CurrentDataSet>
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
        console.log(myVal.appUserDefault)
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
    return (data: any): data is T => schema.safeParse(data).success
  }

  // Create type guards using their respective Zod schemas
  private static isFctItem = this.createIsOfTypeT<myVal.FctItemsWithNote>(myVal.FctItemsWithNoteZod)
  private static isDriItem = this.createIsOfTypeT<myVal.DriItemsWithNote>(myVal.DriItemsWithNoteZod)
  private static isAppUser = this.createIsOfTypeT<myVal.AppUser>(myVal.AppUserZod)
  private static isProjectInfo = this.createIsOfTypeT<myVal.ProjectInfo>(myVal.ProjectInfoZod)
  private static isHouse = this.createIsOfTypeT<myVal.House>(myVal.HouseZod)
  private static isMenu = this.createIsOfTypeT<myVal.Menu>(myVal.MenuItemsZod)
  private static isCurrentDataSet = this.createIsOfTypeT<myVal.CurrentDataSet>(
    myVal.CurrentDataSetZod
  )

  // Then use these type guards within your converter instantiation
  private static fctItemConverter = this.converter<myVal.FctItemsWithNote>(this.isFctItem)
  private static driItemConverter = this.converter<myVal.DriItemsWithNote>(this.isDriItem)
  private static appUserConverter = this.converter<myVal.AppUser>(this.isAppUser)
  private static ProjectInfoConverter = this.converter<myVal.ProjectInfo>(this.isProjectInfo)
  private static houseConverter = this.converter<myVal.House>(this.isHouse)
  private static menuConverter = this.converter<myVal.Menu>(this.isMenu)
  private static currentDataSetConverter = this.converter<myVal.CurrentDataSet>(
    this.isCurrentDataSet
  )

  private static converters: ConverterMap = {
    FctItem: this.fctItemConverter,
    DriItem: this.driItemConverter,
    AppUser: this.appUserConverter,
    ProjectInfo: this.ProjectInfoConverter,
    House: this.houseConverter,
    Menu: this.menuConverter,
    CurrentDataSet: this.currentDataSetConverter
    // More converters can be added here
  }

  private static getTypeConverter<T>(typeName: string): FirestoreDataConverter<T> {
    const converter = this.converters[typeName] as FirestoreDataConverter<T>
    if (!converter) {
      throw new Error(`Converter for type "${typeName}" is not found.`)
    }
    return converter
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

  static async fireDeleteQueryDoc<T>(
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
        console.log('document did not found: fireDeleteQueryDoc')
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

  static async fireGetTyped<T>(
    collectionId: string,
    docId: string,
    typeName: string
  ): Promise<T | null> {
    const converter = this.getTypeConverter<T>(typeName)
    const docRef = doc(db, collectionId, docId).withConverter(converter)

    try {
      splash(true)
      const snapshot = await getDoc(docRef)
      splash(false)
      if (snapshot.exists()) {
        return snapshot.data() as T
      } else {
        return null
      }
    } catch (error) {
      splash(false)
      console.log(error)
      return null
    }
  }

  static async fireGetQueryTyped<T>(
    collectionId: string,
    key: string,
    val: string,
    typeName: string,
    message?: string
  ): Promise<T[] | null> {
    const converter = this.getTypeConverter<T>(typeName)
    const colRef: CollectionReference = collection(db, collectionId)
    const q = query(colRef, where(key, '==', val)).withConverter(converter)
    try {
      splash(true, message || 'downloading data ' + typeName + '...')
      const snapshot = await getDocs(q)
      splash(false)
      const res: Array<T> = []
      if (snapshot.empty) {
        return null
      }
      snapshot.forEach((doc) => {
        const docData = doc.data() as T
        res.push(docData)
      })
      return res
    } catch (error) {
      splash(false)
      console.log(error)
      return null
    }
  }

  static async fireSetTyped<T>(collectionId: string, docId: string, val: T, typeName: string) {
    const converter = this.getTypeConverter<T>(typeName)
    const docRef: DocumentReference<T> = doc(db, collectionId, docId).withConverter(converter)
    try {
      splash(true)
      await setDoc(docRef, val)
      splash(false)
      return true
    } catch (error) {
      splash(false)
      return false
      console.log(error)
    }
  }

  static async fireSetMergeTyped<T>(
    collectionId: string,
    docId: string,
    val: T,
    typeName: string,
    message?: string
  ) {
    splash(true, message || `uploading ${typeName} data to fireStore...`)
    const converter = this.getTypeConverter<T>(typeName)
    const docRef: DocumentReference<T> = doc(db, collectionId, docId).withConverter(converter)
    try {
      await setDoc(docRef, val, { merge: true })
      console.log('done')
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireSetQueryMergeTyped<T>(
    collectionId: string,
    key: string,
    keyVal: string,
    val: T,
    typeName: string,
    message?: string,
    newId?: string
  ) {
    splash(true, message || `uploading ${typeName} data to fireStore...`)
    const converter = this.getTypeConverter<T>(typeName)
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
          const docRef: DocumentReference<T> = doc(db, collectionId, newId).withConverter(converter)
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
