import { IAccountFilters } from './../types/account'
export const INVITATION_STATUS = {
  1: 'Signed up',
  2: 'Did not sign up',
  3: 'Invitation failed',
}

export const NEW_ACCOUNT_INITIAL_STATE = {
  fname: '',
  sname: '',
  email: '',
  country: '',
  accounts: [],
  global_accounts: [],
  role: 'salesperson',
}

export const INITIAL_ACCOUNT_FILTERS: IAccountFilters = {
  activated: '',
  searchKey: '',
}
