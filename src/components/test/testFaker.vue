<script setup lang="ts">
import { faker } from '@faker-js/faker'
// or, if desiring a different locale
// import { fakerDE as faker } from '@faker-js/faker';

const randomName = faker.person.fullName() // Rowan Nikolaus
const randomEmail = faker.internet.email() // Kassandra.Haley@erich.biz
</script>

<template>
  <div class="bg-grey-4">
    halo
    <q-btn label="push me!" />
    <div>name: {{ randomName }}</div>
    <div>email: {{ randomEmail }}</div>
  </div>
</template>
