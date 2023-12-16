import { defineStore } from 'pinia'
import type { diversityState } from '@/models/MyInterface'

export type RootState = {
  diversityStatatus: diversityState[];
};

export const useInterfaceStore = defineStore({
  id: "interfaceStore",
  state: () =>
    ({
      diversityStatus: diversityState[],
    }),

});