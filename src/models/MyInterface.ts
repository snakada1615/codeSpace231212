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
  Id: string
  FoodGroupId: string
  Name: string
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

export enum setDigitKey {
  energy,
  protein,
  vitA,
  iron
}

export const sampleFood = [
  { Id: '001', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Rice' },
  { Id: '002', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Maize' },
  { Id: '003', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Wheat' },
  { Id: '004', FoodGroupId: '1', FoodGroup: 'Grains, roots and tubers', Name: 'Cassava' },
  {
    Id: '005',
    FoodGroupId: '2',
    FoodGroup: 'Vitamin A rich fruits and Vegetable',
    Name: 'Pumpkin'
  },
  {
    Id: '006',
    FoodGroupId: '2',
    FoodGroup: 'Vitamin A rich fruits and Vegetable',
    Name: 'Sweet potato'
  },
  { Id: '007', FoodGroupId: '2', FoodGroup: 'Vitamin A rich fruits and Vegetable', Name: 'Carrot' },
  { Id: '008', FoodGroupId: '2', FoodGroup: 'Vitamin A rich fruits and Vegetable', Name: 'Mango' },
  { Id: '009', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Apple' },
  { Id: '010', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Orange' },
  { Id: '011', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Watermelon' },
  { Id: '012', FoodGroupId: '3', FoodGroup: 'other fruits and Vegetable', Name: 'Peach' },
  { Id: '013', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Soybean' },
  { Id: '014', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Cowpea' },
  { Id: '015', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Lentil' },
  { Id: '016', FoodGroupId: '4', FoodGroup: 'Legumes and nuts', Name: 'Groundnut' },
  { Id: '018', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Beef' },
  { Id: '019', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Port' },
  { Id: '020', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Chicken' },
  { Id: '021', FoodGroupId: '5', FoodGroup: 'meat', Name: 'Goat' },
  { Id: '022', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Milk' },
  { Id: '023', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Cheeze' },
  { Id: '024', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Butter' },
  { Id: '025', FoodGroupId: '6', FoodGroup: 'dairy', Name: 'Yogult' },
  { Id: '026', FoodGroupId: '7', FoodGroup: 'egg', Name: 'egg' },
  { Id: '027', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Salmon' },
  { Id: '028', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Tilapia' },
  { Id: '029', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Tuna' },
  { Id: '030', FoodGroupId: '8', FoodGroup: 'fish', Name: 'Skipjack' },
  { Id: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Sunflower oil' },
  { Id: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Rapeseed oil' },
  { Id: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Palm oil' },
  { Id: '031', FoodGroupId: '9', FoodGroup: 'oil/fat', Name: 'Maize oil' }
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
