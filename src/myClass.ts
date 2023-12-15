export class AnswerItem {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public categoryId: string,
    public questionId: string,
    public optionId: string,
    public optionText: string,
    public score: number
  ) {}
}

export class QuestionItem {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public categoryId: string,
    public questionId: string,
    public questionText: string
  ) {}
}

export class CategoryItem {
  // eslint-disable-next-line no-useless-constructor
  constructor(public categoryId: string, public categoryText: string) {}
}

export class AnswerList<AnswerItem> extends Array<AnswerItem> {
  // constructor(input: AnswerItem[]) {
  //   super(input.length);
  //   input.forEach((element, index) => {
  //     this[index] = element;
  //   });
  // }
  // constructor(items?: Array<AnswerItem>) {
  //   if (typeof items === "array") {
  //     super(...items);
  //   }
  //   console.log(typeof items);
  // }

  add = function (model: AnswerItem) {
    this.push(model);
  };

  getItem(index) {
    return this.find((item) => {
      return item.questionId === index;
    });
  }

  get categoryScore() {
    return this.reduce((accum, current) => {
      const myIndex = accum.findIndex(
        (item) => item.categoryId === current.categoryId
      );
      if (myIndex === -1) {
        accum[current.categoryId] = current.score;
      } else {
        accum[current.categoryId] += current.score;
      }
      return accum;
    }, []);
  }
}
