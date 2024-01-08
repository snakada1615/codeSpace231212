<script setup lang="ts">
import { ref } from 'vue'
import { faker } from '@faker-js/faker'
import type { SexType } from '@faker-js/faker'
import FakerFunc from 'src/models/fakerFunc'
import * as models from 'src/models/MyInterface'

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

const fctOrg: models.FctItem = {
  keyFct: '152',
  FoodGroupId: 'oyatus',
  FctName: 'garigari-kun',
  FoodGroup: 'desert',
  Carb: 8,
  En: 3,
  Fe: 4,
  Fat: 6,
  Pr: 2,
  Va: 7
}

const driOrg: models.DriItem = {
  id: 'id001',
  Name: 'adult',
  En: 20,
  Fe: 45,
  Pr: 62,
  Va: 121
}

const randomUser = ref(userOrg)
const randomFct = ref(fctOrg)
const randomDri = ref(driOrg)

function updateName() {
  randomUser.value = createRandomUser()
}

function updateFct() {
  randomFct.value = FakerFunc.createFct(models.sampleFood)
}

function updateDri() {
  randomDri.value = FakerFunc.createDri()
}

const temp = FakerFunc.createDris()
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
  <q-card class="bg-grey-2 q-pa-sm q-my-md">
    <div>hi</div>
    <q-btn label="here comes new food!" @click="updateFct" class="q-my-sm" color="secondary" />
    <div>{{ randomFct }}</div>
  </q-card>
  <q-card class="bg-grey-2 q-pa-sm q-my-md">
    <div>hi</div>
    <q-btn label="here comes new Dri!" @click="updateDri" class="q-my-sm" color="secondary" />
    <div>{{ randomDri }}</div>
  </q-card>
  <q-card class="bg-grey-2 q-pa-sm q-my-md">
    <div>hi</div>

    <div>{{ temp }}</div>
  </q-card>
</template>
