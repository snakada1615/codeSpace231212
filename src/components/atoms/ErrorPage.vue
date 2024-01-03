<template>
  <div class="errorPage">
    <div class="text-cyan-4" style="font-size: 2em">
      <q-icon name="home" />
      <router-link to="/">Go back home</router-link>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="col-6">
          <q-img src="/src/assets/img/annoyed.png" />
          <a href="https://www.flaticon.com/free-stickers/annoyed" title="annoyed stickers"
            >Annoyed stickers created by kerismaker - Flaticon
          </a>
        </div>
      </div>
      <div class="col-6">
        <h3>Oops! Something went wrong.</h3>
        <q-card class="q-my-md">
          <q-card-section class="bg-grey-6 text-white">
            <h5>{{ errorMessage }}</h5>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

// If you want to get the error from the route params as well:
// const errorFromRoute = route.params.error as ErrorProp | undefined;

const errorMessage = computed(() => {
  // Use error prop first, but fallback to route params if not provided
  return window.history.state.myError || 'Sorry, an unexpected error has occurred.'
})
</script>

<style scoped>
/* Styles for your error page */
.errorPage {
  text-align: center;
}
</style>
