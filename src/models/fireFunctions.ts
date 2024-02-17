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
  query,
  where,
  QueryDocumentSnapshot,
  type DocumentData
} from 'firebase/firestore'
import { Loading } from 'quasar'
import * as myVal from '@/models/myTypes'
import type { CollectionReference } from 'firebase/firestore/lite'

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

export class fireFunc {
  private static converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: WithFieldValue<T>): WithFieldValue<DocumentData> => {
      if (data === null || typeof data !== 'object') {
        throw new Error('data to send firestore must be an object / error in toFIrestore')
      }
      return { ...data } as WithFieldValue<DocumentData>
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
      const data = snapshot.data()
      return data as T
    }
  })

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
    const colRef: CollectionReference = collection(db, collectionId)

    const q = query(colRef, where(key, '==', val))
    try {
      splash(true)
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
    try {
      splash(true)
      await setDoc(doc(db, collectionId, docId), val)
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireSetMerge(collectionId: string, docId: string, val: object) {
    try {
      splash(true)
      await setDoc(doc(db, collectionId, docId), val, { merge: true })
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireGetTyped<T>(collectionId: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionId, docId).withConverter(this.converter<T>())
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
    val: string
  ): Promise<T[] | null> {
    const colRef: CollectionReference = collection(db, collectionId)
    const q = query(colRef, where(key, '==', val)).withConverter(this.converter<T>())
    try {
      splash(true)
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

  static async fireSetTyped<T>(collectionId: string, docId: string, val: T) {
    const docRef: DocumentReference<T> = doc(db, collectionId, docId).withConverter(
      this.converter<T>()
    )
    try {
      splash(true)
      await setDoc(docRef, val)
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }

  static async fireSetMergeTyped<T>(collectionId: string, docId: string, val: T) {
    const docRef: DocumentReference<T> = doc(db, collectionId, docId).withConverter(
      this.converter<T>()
    )
    try {
      splash(true)
      await setDoc(docRef, val, { merge: true })
      splash(false)
    } catch (error) {
      splash(false)
      console.log(error)
    }
  }
}
