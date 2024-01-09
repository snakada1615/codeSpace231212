import { faker } from '@faker-js/faker'
// 全てのintefaceを読み込む
import * as models from './MyInterface'

export default class FakerFunc {
  static createFct(foodGroups: typeof models.sampleFood): models.FctItem {
    const myFood = faker.helpers.arrayElement(foodGroups)
    return {
      keyFct: myFood.keyFct,
      FoodGroupId: myFood.FoodGroupId,
      FctName: myFood.Name,
      FoodGroup: myFood.FoodGroup,
      Carb: faker.number.float({ min: 0, max: 500, precision: 0.1 }),
      En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
      Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
      Fat: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
      Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Va: faker.number.float({ min: 0, max: 500, precision: 0.1 })
    }
  }

  static createFcts() {
    return models.sampleFood.map((item) => {
      return {
        keyFct: item.keyFct,
        FoodGroupId: item.FoodGroupId,
        FctName: item.Name,
        FoodGroup: item.FoodGroup,
        Carb: faker.number.float({ min: 0, max: 500, precision: 0.1 }),
        En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
        Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
        Fat: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
        Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
        Va: faker.number.float({ min: 0, max: 500, precision: 0.1 })
      }
    })
  }

  static createFctRowItem(): models.FctRowItem {
    return {
      ...this.createFct(models.sampleFood),
      NutrientValue: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Star: faker.datatype.boolean(),
      Weight: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      MenuName: faker.helpers.arrayElement(models.commonMenus)
    }
  }

  static createDri(): models.DriItem {
    return {
      id: faker.string.uuid(),
      Name: faker.helpers.arrayElement([
        'child under 6 month',
        'child 6-23 month',
        'lactating',
        'adult',
        'pregnant',
        'adolescent all'
      ]),
      En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
      Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
      Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Va: faker.number.float({ min: 0, max: 500, precision: 0.1 })
    }
  }

  static createDris(): models.DriItems {
    return [
      'child under 6 month',
      'child 6-23 month',
      'lactating',
      'adult',
      'pregnant',
      'adolescent all'
    ].map((item, index) => {
      return <models.DriItem>{
        id: String(index),
        Name: item,
        En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
        Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
        Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
        Va: faker.number.float({ min: 0, max: 500, precision: 0.1 })
      }
    })
  }

  static createMenuItem(): models.MenuItem {
    const food = this.createFct(models.sampleFood)
    const menu = faker.helpers.arrayElement(models.commonMenus)
    return {
      ...food,
      IdMenuItem: faker.string.uuid(),
      KeyFamily: faker.person.firstName(),
      Date: faker.date.past(),
      MenuName: menu,
      NutrientValue: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Star: faker.datatype.boolean(),
      Weight: faker.number.float({ min: 0, max: 50, precision: 0.1 })
    }
  }

  static createMenuItems(): models.MenuItems {
    return [...Array(10)].map(() => {
      return this.createMenuItem()
    })
  }
}
