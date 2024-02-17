<template>
  <q-dialog v-model:model-value="openFlag">
    <q-card>
      <q-card-section>
        <div class="text-h6">Create an Account</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input label="Email" v-model:model-value="email" type="text"></q-input>
        <q-input label="password" v-model:model-value="password" type="password"></q-input>
        <p><q-btn dense icon="login" label="register" @click="register" class="q-mt-sm" /></p>
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
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential
} from 'firebase/auth'
import { Dialog } from 'quasar'
import { useRouter } from 'vue-router' // import router
// import { useProjectData } from '@/stores/mainStore'
// const projectData = useProjectData()

const email = ref('')
const password = ref('')
const errMsg = ref() // ERROR MESSAGE

const router = useRouter() // get a reference to our vue router
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

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value) // need .value because ref()
    .then(() => {
      router.push('/') // redirect to the feed
      closeDialog()
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
      closeDialog()
    })
    .catch((error: Error) => {
      // Handle errors here, such as displaying a message to the user
      console.error(error)
    })
}
</script>
