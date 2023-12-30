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
  max_vol: number
  En: number
  Fe: number
  Pr: number
  Va: number
}

export interface DriItems extends Array<DriItem> {}
