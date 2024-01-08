export interface DiversityState {
  name: string
  status: boolean
}

export interface DiversityStates extends Array<DiversityState> {}

export interface AnswerItem {
  categoryId: string
  questionId: string
  optionId: string
  optionText: string
  score: number
}

export interface QuestionItem {
  categoryId: string
  questionId: string
  questionText: string
}

export interface CategoryItem {
  categoryId: string
  categoryText: string
}

export interface TargetMember {
  targetId: string
  Name: string
  count: number
}

export interface TargetMembers extends Array<TargetMember> {}

export interface DriItem {
  id: string
  Name: string
  En: number
  Fe: number
  Pr: number
  Va: number
}

export interface DriItems extends Array<DriItem> {}

export interface FctItem {
  keyFct: string
  FoodGroupId: string
  FctName: string
  FoodGroup: string
  Carb: number
  En: number
  Fe: number
  Fat: number
  Pr: number
  Va: number
}

export interface FctItems extends Array<FctItem> {}

export interface FctStar {
  Id: string
  Star: boolean
}

export interface FctStars extends Array<FctStar> {}

export enum setDigitKey {
  energy,
  protein,
  vitA,
  iron
}

export interface FctRowItem extends FctItem {
  NutrientValue: number
  Star: boolean
  Weight: number
  MenuName: string
}

export const sampleFood = [
  { keyFct: '001', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Rice' },
  { keyFct: '002', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Maize' },
  { keyFct: '003', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Wheat' },
  { keyFct: '004', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Cassava' },
  {
    keyFct: '005',
    FoodGroupId: '2',
    FoodGroup: 'Vitamin A rich fruits and Vegetable',
    Name: 'Pumpkin'
  },
  {
    keyFct: '006',
    FoodGroupId: '2',
    FoodGroup: 'Vitamin A rich fruits and Vegetable',
    Name: 'Sweet potato'
  },
  {
    keyFct: '007',
    FoodGroupId: '2',
    FoodGroup: 'Vitamin A rich fruits and Vegetable',
    Name: 'Carrot'
  },
  {
    keyFct: '008',
    FoodGroupId: '2',
    FoodGroup: 'Vitamin A rich fruits and Vegetable',
    Name: 'Mango'
  },
  { keyFct: '009', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Apple' },
  { keyFct: '010', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Orange' },
  { keyFct: '011', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Watermelon' },
  { keyFct: '012', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Peach' },
  { keyFct: '013', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Soybean' },
  { keyFct: '014', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Cowpea' },
  { keyFct: '015', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Lentil' },
  { keyFct: '016', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Groundnut' },
  { keyFct: '018', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Beef' },
  { keyFct: '019', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Port' },
  { keyFct: '020', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Chicken' },
  { keyFct: '021', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Goat' },
  { keyFct: '022', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Milk' },
  { keyFct: '023', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Cheeze' },
  { keyFct: '024', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Butter' },
  { keyFct: '025', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Yogult' },
  { keyFct: '026', FoodGroupId: '7', FoodGroup: 'egg', Name: 'egg' },
  { keyFct: '027', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Salmon' },
  { keyFct: '028', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Tilapia' },
  { keyFct: '029', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Tuna' },
  { keyFct: '030', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Skipjack' },
  { keyFct: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Sunflower oil' },
  { keyFct: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Rapeseed oil' },
  { keyFct: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Palm oil' },
  { keyFct: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Maize oil' }
]

export const sampleDri = [{}]

export interface nutrientLabel {
  label: string
  value: keyof FctItem
}

export const nutrientLabels: nutrientLabel[] = [
  { value: 'Carb', label: 'Carbohydrate' },
  { value: 'En', label: 'Energy' },
  { value: 'Pr', label: 'Protein' },
  { value: 'Va', label: 'Vit-A' },
  { value: 'Fat', label: 'Fat' }
]

export interface MenuItem extends FctRowItem {
  IdMenuItem: string
  KeyFamily: string
  Date: Date
}

export interface MenuItems extends Array<MenuItem> {}

export const commonMenus: string[] = [
  '1st meal',
  '2nd meal',
  '3rd meal',
  '4th meal',
  '1st snack',
  '2nd snack',
  '3rd snack'
]
