import { faker } from '@faker-js/faker'
// 全てのintefaceを読み込む
import * as models from './MyInterface'

export default class FakerFunc {
  static createFct(foodGroups: typeof models.sampleFood): models.FctItem {
    const myFood = faker.helpers.arrayElement(foodGroups)
    return {
      Id: myFood.Id,
      Star: false,
      FoodGroupId: myFood.FoodGroupId,
      Name: myFood.Name,
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
        Id: item.Id,
        Star: false,
        FoodGroupId: item.FoodGroupId,
        Name: item.Name,
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
}
