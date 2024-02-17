<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="register">Submit</button></p>
  <p><button @click="signInWithGoogle">signin with Google</button></p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential
} from 'firebase/auth'
import { Dialog } from 'quasar'
import { useRouter } from 'vue-router' // import router
const email = ref('')
const password = ref('')
const router = useRouter() // get a reference to our vue router
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value) // need .value because ref()
    .then((data: UserCredential) => {
      console.log(data)
      router.push('/')
    })
    .catch((error: Error) => {
      console.log(error.name)
      Dialog.create({ message: error.message })
    })
}

const signInWithGoogle = (): void => {
  const provider: GoogleAuthProvider = new GoogleAuthProvider()

  signInWithPopup(auth, provider)
    .then((result: UserCredential) => {
      console.log(result)
      router.push('/')
    })
    .catch((error: Error) => {
      // Handle errors here, such as displaying a message to the user
      console.error(error)
    })
}
</script>
