<script setup lang="ts">
import FctTable from '../atoms/FctTable.vue'
import MenuItemCard from '../atoms/MenuItemCard.vue'
import menuTable from '../atoms/menuTable.vue'
import * as myVal from 'src/models/MyInterface'
import myFunc from 'src/models/MyFunctions'
import FakerFunc from 'src/models/fakerFunc'

const myFct: myVal.FctItems = FakerFunc.createFcts()

const fctFavoriteList: myVal.FctStars = myFct.map((item, index) => {
  const res = index % 2 ? true : false
  return {
    Id: item.Id,
    Star: res
  }
})

const menuItem: myVal.MenuItem = {
  keyFct: '04',
  NutritionValue: 52,
  FctName: 'Apple',
  FoodGroup: 'Fruits',
  Weight: 152,
  MenuName: 'breakfast',
  Star: false,
  En: 0,
  Pr: 0,
  Va: 0,
  Fe: 0
}

const myMenu: myVal.MenuItems = FakerFunc.createMenuItems()

const commonMenus = myVal.commonMenus
</script>

<template>
  <q-card>
    <FctTable :fct="myFct" :fctFavoriteList="fctFavoriteList" />
    <MenuItemCard :commonMenus="commonMenus" :menuItem="menuItem" />
    <menuTable :menuItems="myMenu" />
  </q-card>
</template>
