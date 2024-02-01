import z from 'zod'

const DiversityZod = z.object({
  name: z.string().min(3).max(40),
  status: z.boolean()
})

const DiversityStatesZod = z.array(DiversityZod)

export type DiversityState = z.infer<typeof DiversityZod>

export type DiversityStates = z.infer<typeof DiversityStatesZod>

export enum dataSetNames {
  'appUser',
  'projectInfos',
  'fct',
  'dri',
  'houses',
  'menu'
}

const AnswerItemZod = z.object({
  categoryId: z.string(),
  questionId: z.string(),
  optionId: z.string(),
  optionText: z.string().min(3).max(200),
  score: z.number(),
})

export type AnswerItem=z.infer<typeof AnswerItemZod>

export interface QuestionItem {
  categoryId: string
  questionId: string
  questionText: string
}

export interface CategoryItem {
  categoryId: string
  categoryText: string
}

//現在ユーザーが利用しているデータセット
export interface CurrentDataSet {
  fct: string
  dri: string
  project: string
}

export const currentDataSetDefault = {
  fct: '',
  dri: '',
  project: ''
}

// 現在のユーザー情報
export interface AppUser {
  userId: string
  name: string
  job: string
  title: string
  country: string
  region: string
  town: string
  currentDataSet: CurrentDataSet
}

export const appUserDefault = {
  userId: '',
  name: '',
  job: '',
  title: '',
  country: '',
  region: '',
  town: '',
  currentDataSet: currentDataSetDefault
}

export interface ProjectInfo {
  userId: string
  projectName: string
  projectId: string
  locationId: string
  location: string
  targetPopulation: FamilyMembers
}

export interface ProjectInfos extends Array<ProjectInfo> {}

export const sampleFamilyMemberCategory = [
  'child under 6 month',
  'child 6-23 month',
  'lactating',
  'adult',
  'pregnant',
  'adolescent all'
]

export interface DriItem {
  DriId: string
  Name: string
  En: number
  Fe: number
  Pr: number
  Va: number
}

export const driItemDefault = {
  DriId: '',
  Name: '',
  En: 0,
  Fe: 0,
  Pr: 0,
  Va: 0
}

export interface DriItems extends Array<DriItem> {}

export interface DriItemsWithNote {
  data: DriItems
  note: string
  userId: string
}

export interface FamilyMember extends DriItem {
  count: number
}

export const familyMemberDefault = {
  ...driItemDefault,
  count: 0
}

export interface FamilyMembers extends Array<FamilyMember> {}

const familyMembersDefault = sampleFamilyMemberCategory.map((item, index) => {
  return {
    ...familyMemberDefault,
    DriId: String(index),
    Name: item
  }
})

export interface House {
  projectId: string
  userId: string
  locationId: string
  familyId: string
  familyName: string
  familyMembers: FamilyMembers
}

export interface Houses extends Array<House> {}

export const houseDefault = {
  projectId: '',
  userId: '',
  locationId: '',
  familyId: '',
  familyName: '',
  familyMembers: familyMembersDefault
}

export const projectInfoDefault = {
  userId: '',
  projectName: '',
  projectId: '',
  locationId: '',
  location: '',
  targetPopulation: familyMembersDefault
}

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

export const fctItemDefault = {
  keyFct: '',
  FoodGroupId: '',
  FctName: '',
  FoodGroup: '',
  Carb: 0,
  En: 0,
  Fe: 0,
  Fat: 0,
  Pr: 0,
  Va: 0
}

export interface FctItems extends Array<FctItem> {}

// fct tableに検索用の付加情報を追加したもの
export interface FctItemsWithNote {
  data: FctItems
  note: string
  userId: string
}

export const fctItemsWIthNoteDefault = {
  data: [fctItemDefault],
  note: '',
  userId: ''
}

export const driItemsWIthNoteDefault = {
  data: [driItemDefault],
  note: '',
  userId: ''
}

export interface FctStar {
  IdStar: string
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

export const fctRowItemDefault = {
  ...fctItemDefault,
  NutrientValue: 0,
  Star: false,
  Weight: 0,
  MenuName: ''
}

export interface FctAddOptions {
  NutrientValue: number
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
  userId: string
  projectId: string
  KeyFamily: string
  menuItemId: string
  Date: Date
}

export const menuItemDefault = {
  ...fctRowItemDefault,
  menuItemId: '',
  KeyFamily: '',
  projectId: '',
  userId: '',
  Date: new Date()
}

// export interface Menu {
//   projectId: string
//   userId: string
//   items: Array<MenuItem>
// }

export interface Menu extends Array<MenuItem> {}

export interface Menues extends Array<Menu> {}

export const commonMenus: string[] = [
  '1st meal',
  '2nd meal',
  '3rd meal',
  '4th meal',
  '1st snack',
  '2nd snack',
  '3rd snack'
]

export type AllProjectData = AppUser | Houses | Menues

export enum projectDataType {
  'appUser',
  'Projects',
  'Houses',
  'Menus'
}
