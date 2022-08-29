import create from 'zustand'

import { TData } from '~/components/multi-select-dropdown'

interface TAccount extends TData {
  isGlobal: boolean
}

interface IUseSalesOnBoardingStore {
  accountsSelected: TAccount[]
  setAccountsSelected: (val: TAccount[]) => void
}

const useSalesOnBoardingStore = create<IUseSalesOnBoardingStore>((set) => ({
  accountsSelected: [],
  setAccountsSelected: (val: TAccount[]) =>
    set(() => ({
      accountsSelected: val,
    })),
}))

export default useSalesOnBoardingStore
