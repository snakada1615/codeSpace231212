import z from 'zod'

export const DiversityZod = z.object({
  name: z.string().min(3).max(40),
  status: z.boolean()
})

export const DiversityStatesZod = z.array(DiversityZod)

export type DiversityState = z.infer<typeof DiversityZod>

export type DiversityStates = z.infer<typeof DiversityStatesZod>

export const diversityStateDefault = {
  name: '',
  status: false
}

export enum dataSetNames {
  'appUser',
  'projectInfos',
  'fct',
  'dri',
  'houses',
  'menu'
}

export const AnswerItemZod = z.object({
  categoryId: z.string(),
  questionId: z.string(),
  optionId: z.string(),
  optionText: z.string().min(3).max(200),
  score: z.number()
})

export type AnswerItem = z.infer<typeof AnswerItemZod>

export const QuestionItemZod = z.object({
  categoryId: z.string(),
  questionId: z.string(),
  questionText: z.string().min(3).max(500)
})

export type QuestionItem = z.infer<typeof QuestionItemZod>

export const CategoryItemZod = z.object({
  categoryId: z.string(),
  categoryText: z.string().min(3).max(200)
})

export type CategoryItem = z.infer<typeof CategoryItemZod>

// 現在ユーザーが利用しているデータセット
export const CurrentDataSetZod = z.object({
  user: z.string(),
  currentDataSet: z.string(),
  fct: z.string(),
  dri: z.string(),
  house: z.string(),
  menu: z.string(),
  nutrient: z.string(),
  crop: z.string(),
  projectInfo: z.string()
})

export type CurrentDataSet = z.infer<typeof CurrentDataSetZod>

export const currentDataSetDefault = {
  currentDataSet: '',
  user: '',
  fct: '',
  dri: '',
  house: '',
  menu: '',
  nutrient: '',
  crop: '',
  projectInfo: ''
}

export type CurrentDataSetBlank = typeof currentDataSetDefault

// 現在のユーザー情報
export const AppUserZod = z.object({
  user: z.string(),
  name: z.string(),
  job: z.string(),
  title: z.string(),
  country: z.string(),
  region: z.string(),
  town: z.string().optional()
})

export const AppUserZod_v = z.object({
  user: z.string(),
  name: z.string().min(3).max(200),
  job: z.string().min(3).max(200),
  title: z.string().min(3).max(200),
  country: z.string().min(3).max(200),
  region: z.string().min(3).max(200),
  town: z.string().min(3).max(200).optional()
})

export type AppUser = z.infer<typeof AppUserZod>

export type AppUser_v = z.infer<typeof AppUserZod_v>

export const appUserDefault = {
  user: '',
  name: '',
  job: '',
  title: '',
  country: '',
  region: '',
  town: ''
}

export const sampleFamilyMemberCategory = [
  'child under 6 month',
  'child 6-23 month',
  'lactating',
  'adult',
  'pregnant',
  'adolescent all'
]

export const DriItemZod = z.object({
  DriId: z.string(),
  Name: z.string().min(3).max(200),
  En: z.number().gte(0),
  Fe: z.number().gte(0),
  Pr: z.number().gte(0),
  Va: z.number().gte(0)
})

export const DriItemsZod = z.array(DriItemZod)

export type DriItem = z.infer<typeof DriItemZod>

export type DriItems = z.infer<typeof DriItemsZod>

export const driItemDefault = {
  DriId: '',
  Name: '',
  En: 1,
  Fe: 1,
  Pr: 1,
  Va: 1
}

export const DriItemsWithNoteZod = z.object({
  data: DriItemsZod,
  note: z.string(),
  user: z.string(),
  dri: z.string()
})

export type DriItemsWithNote = z.infer<typeof DriItemsWithNoteZod>

export const FamilyMemberZod = DriItemZod.extend({
  count: z.number()
})

export const FamilyMembersZod = z.array(FamilyMemberZod)

export type FamilyMember = z.infer<typeof FamilyMemberZod>

export type FamilyMembers = z.infer<typeof FamilyMembersZod>

export type FamilyMemberBlank = typeof familyMemberDefault

export type FamilyMembersBlank = typeof familyMembersDefault

export const familyMemberDefault = {
  ...driItemDefault,
  count: 0
}

export const familyMembersDefault = sampleFamilyMemberCategory.map((item, index) => {
  return {
    ...familyMemberDefault,
    DriId: String(index),
    Name: item
  }
})

export const ProjectInfoZod = z.object({
  user: z.string(),
  projectName: z.string(),
  projectInfo: z.string(),
  locationId: z.string(),
  location: z.string(),
  targetPopulation: FamilyMembersZod
})

export const ProjectInfoZod_v = z.object({
  user: z.string(),
  projectName: z.string().min(3).max(200),
  projectInfo: z.string(),
  locationId: z.string(),
  location: z.string().min(3).max(200),
  targetPopulation: FamilyMembersZod
})

export const projectInfoDefault = {
  user: '',
  projectName: '',
  projectInfo: '',
  locationId: '',
  location: '',
  targetPopulation: familyMembersDefault
}

export const ProjectInfosZod = z.array(ProjectInfoZod)

export type ProjectInfo = z.infer<typeof ProjectInfoZod>

export type ProjectInfos = z.infer<typeof ProjectInfosZod>

export type ProjectInfoBlank = typeof projectInfoDefault

export const HouseZod = z.object({
  projectInfo: z.string(),
  user: z.string(),
  locationId: z.string(),
  house: z.string(),
  familyName: z.string(),
  familyMembers: FamilyMembersZod
})

export const HouseZod_v = z.object({
  projectInfo: z.string(),
  user: z.string(),
  locationId: z.string().min(3).max(200),
  house: z.string(),
  familyName: z.string().min(3).max(200),
  familyMembers: FamilyMembersZod
})

export const HousesZod = z.array(HouseZod)

export type House = z.infer<typeof HouseZod>

export type Houses = z.infer<typeof HousesZod>

export type HouseBlank = typeof houseDefault

export type HousesBlank = HouseBlank[]

export const houseDefault = {
  projectInfo: '',
  user: '',
  locationId: '',
  house: '',
  familyName: 'family01',
  familyMembers: familyMembersDefault
}

export const housesDefault = [houseDefault]

export const FctItemZod = z.object({
  keyFct: z.string(),
  FoodGroupId: z.string(),
  FctName: z.string(),
  FoodGroup: z.string(),
  Carb: z.number(),
  En: z.number(),
  Pr: z.number(),
  Fe: z.number(),
  Fat: z.number(),
  Va: z.number()
})

export const FctItemZod_v = z.object({
  keyFct: z.string(),
  FoodGroupId: z.string(),
  FctName: z.string().min(3).max(200),
  FoodGroup: z.string().min(3).max(200),
  Carb: z.number().gte(0),
  En: z.number().gte(0),
  Pr: z.number().gte(0),
  Fe: z.number().gte(0),
  Fat: z.number().gte(0),
  Va: z.number().gte(0)
})

export const FctItemsZod = z.array(FctItemZod)

export type FctItem = z.infer<typeof FctItemZod>

export type FctItems = z.infer<typeof FctItemsZod>

export const fctItemDefault = {
  keyFct: '',
  FoodGroupId: '',
  FctName: '',
  FoodGroup: '',
  Carb: 1,
  En: 1,
  Fe: 1,
  Fat: 1,
  Pr: 1,
  Va: 1
}

// fct tableに検索用の付加情報を追加したもの
export const FctItemsWithNoteZod = z.object({
  data: FctItemsZod,
  note: z.string(),
  user: z.string(),
  fct: z.string()
})

export type FctItemsWithNote = Zod.infer<typeof FctItemsWithNoteZod>

export const fctItemsWIthNoteDefault = {
  data: [fctItemDefault],
  note: '',
  user: '',
  fct: ''
}

export const driItemsWIthNoteDefault = {
  data: [driItemDefault],
  note: '',
  user: '',
  dri: ''
}

export const FctStarZod = z.object({
  IdStar: z.string(),
  Star: z.boolean()
})

export const FctStarsZod = z.array(FctStarZod)

export type FctStar = z.infer<typeof FctStarZod>

export type FctStars = z.infer<typeof FctStarsZod>

export enum setDigitKey {
  energy,
  protein,
  vitA,
  iron
}

export const FctRowItemZod = FctItemZod.extend({
  NutrientValue: z.number(),
  Star: z.boolean(),
  Weight: z.number(),
  MenuName: z.string()
})

export const FctRowItemZod_v = FctItemZod.extend({
  NutrientValue: z.number().gte(0),
  Star: z.boolean(),
  Weight: z.number().gte(0),
  MenuName: z.string().min(3).max(200)
})

export type FctRowItem = z.infer<typeof FctRowItemZod>

export const fctRowItemDefault = {
  ...fctItemDefault,
  NutrientValue: 0,
  Star: false,
  Weight: 0,
  MenuName: ''
}

export const FctAddOptionsZod = z.object({
  NutrientValue: z.number().gte(0),
  Weight: z.number().gte(0),
  MenuName: z.string().min(3).max(200)
})

export type FctAddOptions = z.infer<typeof FctAddOptionsZod>

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

export const nutrientLabelZod = z.object({
  label: z.string().min(3).max(200),
  value: FctItemZod.keyof()
})

export type nutrientLabel = z.infer<typeof nutrientLabelZod>

export const nutrientLabels: nutrientLabel[] = [
  { value: 'Carb', label: 'Carbohydrate' },
  { value: 'En', label: 'Energy' },
  { value: 'Pr', label: 'Protein' },
  { value: 'Va', label: 'Vit-A' },
  { value: 'Fat', label: 'Fat' }
]

export const MenuItemsZod = z.array(FctRowItemZod)

export const MenuZod = z.object({
  data: MenuItemsZod,
  note: z.string(),
  user: z.string(),
  projectInfo: z.string(),
  house: z.string(),
  menu: z.string(),
  date: z.number()
})

export const MenuesZod = z.array(MenuZod)

export const MenuZod_v = z.object({
  data: MenuItemsZod,
  note: z.string(),
  user: z.string(),
  projectInfo: z.string(),
  house: z.string(),
  menu: z.string(),
  date: z.number()
})

// export const MenuesZod = z.array(MenuItemsZod)

export type MenuItem = z.infer<typeof FctRowItemZod>

export type MenuItems = z.infer<typeof MenuItemsZod>

export type Menu = z.infer<typeof MenuZod>

export const menuDefault = {
  data: [fctRowItemDefault],
  user: '',
  note: '',
  projectInfo: '',
  house: '',
  menu: '',
  date: 0
}

export const menuesDefault = [
  {
    data: [fctRowItemDefault],
    user: '',
    note: '',
    projectInfo: '',
    house: '',
    menu: '',
    date: 0
  }
]

export const commonMenus: string[] = [
  '1st meal',
  '2nd meal',
  '3rd meal',
  '4th meal',
  '1st snack',
  '2nd snack',
  '3rd snack'
]

export type AllProjectData = AppUser | Houses | Menu

export const PiniaStateZod = z.object({
  // 現在利用しているユーザーの情報
  appUser: AppUserZod.nullable(),
  // ユーザーが取り組んでいるプロジェクトの情報
  projectInfo: ProjectInfoZod,
  fct: FctItemsWithNoteZod.nullable(),
  dri: DriItemsWithNoteZod.nullable(),
  // プロジェクトで対象とする家庭の情報
  house: HousesZod.nullable(),
  // 各家庭での食事調査結果
  menu: MenuesZod.nullable(),
  // デフォルトで使うデータベース名
  currentDataSet: CurrentDataSetZod,
  // loading時のsplash画面表示
  loading: z.boolean(),
  copyDataFromOrigin: z.object({ fct: z.string(), dri: z.string() }),
  isUpdate: z.boolean(),
  modifiedStates: z.string().array()
})

export const PiniaState_partialZod = PiniaStateZod.partial()

export type PiniaState = z.infer<typeof PiniaStateZod>

export type PiniaState_partial = z.infer<typeof PiniaState_partialZod>

export const PiniaStateDefault = {
  // 現在利用しているユーザーの情報
  appUser: appUserDefault,
  // ユーザーが取り組んでいるプロジェクトの情報
  projectInfo: projectInfoDefault,
  fct: null,
  dri: null,
  // プロジェクトで対象とする家庭の情報
  house: null,
  // 各家庭での食事調査結果
  menu: null,
  // デフォルトで使うデータベース名
  currentDataSet: currentDataSetDefault,
  // loading時のsplash画面表示
  loading: false,
  copyDataFromOrigin: {
    fct: '08e5ee1f-8321-4cc3-8b9f-00619a262931',
    dri: '5139dec2-f340-46bd-aed4-57670991bab7'
  },
  isUpdate: false,
  modifiedStates: []
}

export type ConverterTypeMap = {
  fct: FctItemsWithNote
  dri: DriItemsWithNote
  user: PiniaState
  projectInfo: ProjectInfo
  house: House
  menu: Menu
  currentDataSet: CurrentDataSet
  piniaStatePartial: PiniaState_partial
  // Add other collection mappings here...
}
