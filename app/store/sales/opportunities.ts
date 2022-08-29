import create from 'zustand'

import { IOpportunity, IOpportunityAccount } from '~/types/opportunities'

interface IUseSalesOpportunities {
  activeAccount: IOpportunityAccount | null
  setActiveAccount: (val: IOpportunityAccount | null) => void
  activeOpportunity: IOpportunity | null
  setActiveOpportunity: (val: IOpportunity | null) => void
  updateActiveOpportunity: (val: Partial<IOpportunity>) => void
  searchOps: string
  setSearchOps: (val: string) => void
  resetOps: () => void
}

const useSalesOpportunities = create<IUseSalesOpportunities>((set) => ({
  activeAccount: null,
  setActiveAccount: (val: IOpportunityAccount | null) =>
    set(() => ({
      activeAccount: val,
    })),
  activeOpportunity: null,
  setActiveOpportunity: (val: IOpportunity | null) =>
    set(() => ({
      activeOpportunity: val,
    })),
  updateActiveOpportunity: (val: Partial<IOpportunity>) =>
    set((state) => {
      return {
        activeOpportunity: state.activeOpportunity
          ? { ...state.activeOpportunity, ...val }
          : null,
      }
    }),
  searchOps: '',
  setSearchOps: (val: string) =>
    set(() => ({
      searchOps: val,
    })),
  resetOps: () =>
    set(() => ({
      activeAccount: null,
      activeOpportunity: null,
      searchOps: '',
    })),
}))

export default useSalesOpportunities
