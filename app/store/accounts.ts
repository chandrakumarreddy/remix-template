import create from 'zustand'

import { NEW_ACCOUNT_INITIAL_STATE } from '~/constants/accounts'
import { TDeleteAccount, TEditAccount, TNewAccount } from '~/types/account'

import { INITIAL_ACCOUNT_FILTERS } from './../constants/accounts'
import { IAccountFilters } from './../types/account'

interface IUseAccountsStore {
  accountsSelected: string[]
  isAllAccountsSelected: boolean
  setAccountsSelected: (val: string) => void
  setAllAccountsSelected: (val: string[], isAllChecked: boolean) => void
  deleteAccount: TDeleteAccount
  setDeleteAccount: (account: TDeleteAccount) => void
  newAccountData: TNewAccount
  setNewAccountData: (account: Partial<TNewAccount>) => void
  editAccountData: TEditAccount
  setEditAccountData: (account: TEditAccount) => void
  filters: IAccountFilters
  setFilters: (filters: Partial<IAccountFilters>, reset?: boolean) => void
  accountsSearch: string
  setAccountsSearch: (val: string) => void
}

const useAccountsStore = create<IUseAccountsStore>((set) => ({
  accountsSelected: [],
  isAllAccountsSelected: false,
  setAccountsSelected: (val: string) =>
    set((state) => {
      if (state.accountsSelected.includes(val)) {
        const index = state.accountsSelected.findIndex((item) => item === val)
        state.accountsSelected = [
          ...state.accountsSelected.slice(0, index),
          ...state.accountsSelected.slice(index + 1),
        ]
      } else {
        state.accountsSelected.push(val)
      }
      return {
        accountsSelected: [...state.accountsSelected],
      }
    }),
  setAllAccountsSelected: (val: string[], isAllChecked: boolean) =>
    set(() => ({
      accountsSelected: val,
      isAllAccountsSelected: isAllChecked,
    })),
  deleteAccount: null,
  setDeleteAccount: (account: TDeleteAccount) =>
    set(() => ({ deleteAccount: account })),
  newAccountData: NEW_ACCOUNT_INITIAL_STATE,
  setNewAccountData: (account: Partial<TNewAccount>) =>
    set((state) => ({
      newAccountData: { ...state.newAccountData, ...account },
    })),
  editAccountData: null,
  setEditAccountData: (account: TEditAccount) =>
    set((state) => ({
      editAccountData: account
        ? { ...state.editAccountData, ...account }
        : null,
    })),
  filters: INITIAL_ACCOUNT_FILTERS,
  setFilters: (filters: Partial<IAccountFilters>, reset = false) =>
    set((state) => ({
      filters: reset
        ? INITIAL_ACCOUNT_FILTERS
        : { ...state.filters, ...filters },
    })),
  accountsSearch: '',
  setAccountsSearch: (val: string) =>
    set(() => ({
      accountsSearch: val,
    })),
}))

export default useAccountsStore
