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
import * as myVal from '@/models/MyInterface'
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
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      return snapshot.data()
    } else {
      return null
    }
  }

  static async fireGetQuery(collectionId: string, key: string, val: string) {
    const colRef: CollectionReference = collection(db, collectionId)

    const q = query(colRef, where(key, '==', val))
    const snapshot = await getDocs(q)
    const res: Array<myVal.AllProjectData> = []
    snapshot.forEach((doc) => {
      const docData = doc.data() as myVal.AllProjectData // type assertion...
      res.push(docData)
    })
    return res
  }

  static async fireSet(collectionId: string, docId: string, val: object) {
    await setDoc(doc(db, collectionId, docId), val)
  }

  static async fireSetMerge(collectionId: string, docId: string, val: object) {
    await setDoc(doc(db, collectionId, docId), val, { merge: true })
  }

  static async fireGetQueryTyped<T>(collectionId: string, key: string, val: string): Promise<T[]> {
    const colRef: CollectionReference = collection(db, collectionId)
    const q = query(colRef, where(key, '==', val)).withConverter(this.converter<T>())
    const snapshot = await getDocs(q)
    const res: Array<T> = []
    snapshot.forEach((doc) => {
      const docData = doc.data() as T
      res.push(docData)
    })
    return res
  }

  static async fireSetTyped<T>(collectionId: string, docId: string, val: T) {
    const docRef: DocumentReference<T> = doc(db, collectionId, docId).withConverter(
      this.converter<T>()
    )
    await setDoc(docRef, val)
  }

  static async fireSetMergeTyped<T>(collectionId: string, docId: string, val: T) {
    const docRef: DocumentReference<T> = doc(db, collectionId, docId).withConverter(
      this.converter<T>()
    )
    await setDoc(docRef, val, { merge: true })
  }
}
