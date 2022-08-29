import { IUserAccount } from './account'

export interface IRootData {
  role: 'tenant_admin' | 'tenant'
  user_id: number
  tenant_id: number
  accessToken: string
  short_code: string
  user: IUserAccount
}
