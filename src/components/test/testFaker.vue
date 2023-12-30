<script setup lang="ts">
import { ref } from 'vue'
import { faker } from '@faker-js/faker'
import type { SexType } from '@faker-js/faker'

type favoriteFood = 'cereal' | 'meat' | 'vegetable'

interface User {
  _id: string
  avatar: string
  birthday: Date
  email: string
  firstName: string
  lastName: string
  sex: SexType
  favoriteFood: favoriteFood
  BMI: number
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
    favoriteFood: faker.helpers.arrayElement(['cereal', 'meat', 'vegetable']),
    BMI: faker.number.float({ min: 10, max: 50, precision: 0.1 })
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
  favoriteFood: 'vegetable',
  BMI: 15.6
}

const randomUser = ref(userOrg)

function updateName() {
  randomUser.value = createRandomUser()
}
</script>

<template>
  <q-card class="bg-grey-2 q-pa-sm">
    <q-btn label="here comes new user!" @click="updateName" class="q-my-sm" color="secondary" />
    <div>First Name: {{ randomUser.firstName }}</div>
    <div>Last Name: {{ randomUser.lastName }}</div>
    <div>sex: {{ randomUser.sex }}</div>
    <div>Birthday: {{ randomUser.birthday }}</div>
    <div>BMI: {{ randomUser.BMI }}</div>
    <div>Favorite food: {{ randomUser.favoriteFood }}</div>
  </q-card>
</template>
