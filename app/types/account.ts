import type { Dispatch, SetStateAction } from 'react'

import { TData } from '~/components/multi-select-dropdown'

export interface IDetailsProps {
  setActive: Dispatch<SetStateAction<number>>
  handleClose: () => void
}

interface INewAccount {
  fname: string
  sname: string
  email: string
  country: string
  accounts: TAccount[]
  global_accounts: TAccount[]
}
export type TNewAccount = INewAccount

export type IAccount = {
  id: number
  name: string
  short_name: string
  website: string
  logo_url: string
}
export interface IUserAccount {
  name?: string
  fname: string
  sname: string
  email: string
  country: string
  role?: string
  accounts: IAccount[]
  global_accounts: IAccount[]
  activated: string
  col6: string
  statusClass: string
  id: number
  onboarded?: boolean
}

export type TDeleteAccount = IUserAccount | null

export interface TAccount extends TData {
  isGlobal: boolean
}
interface IEditAccount extends IUserAccount {
  _accounts: TAccount[]
}

export type TEditAccount = Partial<IEditAccount> | null

export interface IAccountFilters {
  activated: 'Did not sign up' | 'Signed up' | ''
  searchKey: string
}
