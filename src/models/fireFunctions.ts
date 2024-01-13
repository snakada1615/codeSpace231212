// import { useRouter } from 'vue-router'
// import { onBeforeUnmount } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, type User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

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
  // static useAuthListener = () => {
  //   const authListener = getAuth().onAuthStateChanged(function (user) {
  //     if (!user) {
  //       // not logged in
  //       alert('you must be logged in to view this. redirecting to the home page')
  //       router.push('/')
  //     }
  //   })
  //   onBeforeUnmount(() => {
  //     // clear up listener
  //     authListener()
  //   })
  // }

  static async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }
}
