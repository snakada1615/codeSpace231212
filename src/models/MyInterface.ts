export interface diversityState {
  name: string
  status: boolean
}

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

/* export interface AnswerList<AnswerItem> extends Array<AnswerItem> {
  // input: AnswerItem[]) {
  //   super(input.length);
  //   input.forEach((element, index) => {
  //     this[index] = element;
  //   });
  // }
  // items?: Array<AnswerItem>) {
  //   if (typeof items === "array") {
  //     super(...items);
  //   }
  //   console.log(typeof items);
  // }

  add = function (model: AnswerItem) {
    this.push(model)
  }

  getItem(index) {
    return this.find((item) => {
      return item.questionId === index
    })
  }

  get categoryScore() {
    return this.reduce((accum, current) => {
      const myIndex = accum.findIndex((item) => item.categoryId === current.categoryId)
      if (myIndex === -1) {
        accum[current.categoryId] = current.score
      } else {
        accum[current.categoryId] += current.score
      }
      return accum
    }, [])
  }
}
 */
