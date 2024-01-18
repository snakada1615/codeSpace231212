import { faker } from '@faker-js/faker'
// 全てのintefaceを読み込む
import * as myVal from './MyInterface'

export default class FakerFunc {
  static createFct(foodGroups: typeof myVal.sampleFood): myVal.FctItem {
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
    return myVal.sampleFood.map((item) => {
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

  static createFctAddOptions(): myVal.FctAddOptions {
    return {
      NutrientValue: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Weight: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      MenuName: faker.helpers.arrayElement(myVal.commonMenus)
    }
  }

  static createDri(): myVal.DriItem {
    return {
      DriId: faker.string.uuid(),
      Name: faker.helpers.arrayElement(myVal.sampleFamilyMemberCategory),
      En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
      Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
      Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Va: faker.number.float({ min: 0, max: 500, precision: 0.1 })
    }
  }

  static createDris(): myVal.DriItems {
    return myVal.sampleFamilyMemberCategory.map((item, index) => {
      return <myVal.DriItem>{
        DriId: String(index),
        Name: item,
        En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
        Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
        Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
        Va: faker.number.float({ min: 0, max: 500, precision: 0.1 })
      }
    })
  }

  static createFamilyMembers(): myVal.FamilyMembers {
    return myVal.sampleFamilyMemberCategory.map((item, index) => {
      return {
        DriId: String(index),
        Name: item,
        En: faker.number.float({ min: 0, max: 4000, precision: 0.1 }),
        Fe: faker.number.float({ min: 0, max: 50, precision: 0.1 }),
        Pr: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
        Va: faker.number.float({ min: 0, max: 500, precision: 0.1 }),
        count: faker.number.int({ min: 0, max: 10 })
      }
    })
  }

  static createHouse(): myVal.House {
    return {
      projectId: faker.string.uuid(),
      locationId: faker.string.uuid(),
      familyId: faker.string.uuid(),
      familyName: faker.person.firstName(),
      familyMembers: this.createFamilyMembers()
    }
  }

  static createMenuItem(): myVal.MenuItem {
    const food = this.createFct(myVal.sampleFood)
    const menu = faker.helpers.arrayElement(myVal.commonMenus)
    return {
      ...food,
      menuItemId: faker.string.uuid(),
      KeyFamily: faker.person.firstName(),
      Date: faker.date.past(),
      MenuName: menu,
      NutrientValue: faker.number.float({ min: 0, max: 200, precision: 0.1 }),
      Star: faker.datatype.boolean(),
      Weight: faker.number.float({ min: 0, max: 50, precision: 0.1 })
    }
  }

  static createMenu(): myVal.Menu {
    return [...Array(10)].map(() => {
      return this.createMenuItem()
    })
  }
}
