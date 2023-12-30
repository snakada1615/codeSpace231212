<script setup lang="ts">
import { ref } from 'vue'
import { faker } from '@faker-js/faker'
import type { SexType } from '@faker-js/faker'

type SubscriptionTier = 'free' | 'basic' | 'business'

interface User {
  _id: string
  avatar: string
  birthday: Date
  email: string
  firstName: string
  lastName: string
  sex: SexType
  subscriptionTier: SubscriptionTier
}

function createRandomUser(): User {
  return {
    _id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    sex: faker.person.sexType(),
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'business'])
  }
}

const userOrg: User = {
  _id: 'c57b27c4-3df9-4b36-a8ae-e09293ef3b93',
  avatar:
    'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/593.jpg',
  birthday: new Date(),
  email: 'King_Heathcote@gmail.com',
  firstName: 'Sylvan',
  lastName: 'Price',
  sex: 'female',
  subscriptionTier: 'free'
}

const randomUser = ref(userOrg)

function updateName() {
  randomUser.value = createRandomUser()
}
</script>

<template>
  <div class="bg-grey-4">
    halo
    <q-btn label="push me!" @click="updateName" />
    <div>{{ randomUser }}</div>
  </div>
</template>
