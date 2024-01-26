<template>
  <q-dialog v-model:model-value="openFlag">
    <q-card>
      <q-card-section>
        <div class="text-h6">Login to Your Account</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input label="Email" v-model:model-value="email" type="text"></q-input>
        <q-input label="password" v-model:model-value="password" type="password"></q-input>
        <p><q-btn dense icon="login" label="login" @click="signIn" class="q-mt-sm" /></p>
        <p>
          <q-btn dense icon="mail" label="signin with Google" @click="signInWithGoogle" />
        </p>
        <p v-if="errMsg" class="text-warning">{{ errMsg }}</p>
        <q-btn flat label="Cancel" color="primary" @click="closeDialog" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { useRouter } from 'vue-router' // import router
// import { useProjectData } from '@/stores/mainStore'
// const projectData = useProjectData()

const router = useRouter() // get a reference to our vue router
const email = ref('')
const password = ref('')
const errMsg = ref() // ERROR MESSAGE

const auth = getAuth()

const props = defineProps({
  openDialog: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'update:openDialog', value: boolean): void
}>()

const openFlag = computed(() => props.openDialog)

const closeDialog = () => {
  emits('update:openDialog', false)
}

const signIn = () => {
  // we also renamed this method
  signInWithEmailAndPassword(auth, email.value, password.value) // THIS LINE CHANGED
    .then(() => {
      errMsg.value = ''
      router.push('/')
      closeDialog()
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
      router.push('/')
      closeDialog()
    })
    .catch((error: Error) => {
      // Handle errors here, such as displaying a message to the user
      console.error(error)
      alert(error.message)
    })
}
</script>
