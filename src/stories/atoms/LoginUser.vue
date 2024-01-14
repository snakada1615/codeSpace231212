<template>
  <h1>Login to Your Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signIn">Submit</button></p>
  <p><button @click="signInWithGoogle">signin with Google</button></p>
  <p v-if="errMsg" class="text-warning">{{ errMsg }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  type UserCredential
} from 'firebase/auth'
import { useRouter } from 'vue-router' // import router

const router = useRouter() // get a reference to our vue router
const email = ref('')
const password = ref('')
const errMsg = ref() // ERROR MESSAGE

const auth = getAuth()

const signIn = () => {
  // we also renamed this method
  signInWithEmailAndPassword(auth, email.value, password.value) // THIS LINE CHANGED
    .then(() => {
      errMsg.value = ''
      router.push('/feed') // redirect to the feed
    })
    .catch((error) => {
      switch (error.name) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid email'
          break
        case 'auth/user-not-found':
          errMsg.value = 'No account with that email was found'
          break
        case 'auth/wrong-password':
          errMsg.value = 'Incorrect password'
          break
        default:
          errMsg.value = 'Email or password was incorrect'
          break
      }
    })
}
const signInWithGoogle = (): void => {
  const provider: GoogleAuthProvider = new GoogleAuthProvider()

  signInWithPopup(auth, provider)
    .then(() => {
      errMsg.value = ''
      router.push('/feedTest')
    })
    .catch((error: Error) => {
      // Handle errors here, such as displaying a message to the user
      console.error(error)
      alert(error.message)
    })
}
</script>
