import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
    doublePlusOne(): number {
      return this.doubleCount + 1
    }
  },
  actions: {
    countUp() {
      this.count++
    }
  }
})

export default useCounterStore
