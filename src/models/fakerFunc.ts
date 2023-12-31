import { faker } from '@faker-js/faker'
// 全てのintefaceを読み込む
import * as models from './MyInterface'

export default class FakerFunc {
  static createFct(foodGroups: typeof models.sampleFood): models.FctItem {
    const myFood = faker.helpers.arrayElement(foodGroups)
    return {
      Id: myFood.Id,
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
}
