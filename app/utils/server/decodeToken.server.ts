import { jwtDecode } from '~/remix.server'
import { getSession, logout } from '~/session.server'

export interface TUserToken {
  role: 'tenant_admin' | 'tenant' | 'salesperson'
  user_id: number
  tenant_id: number
  short_code: string
}

export default function decodeToken(token: string) {
  if (!token) return null
  const { role, user_id, tenant_id, short_code } = jwtDecode<TUserToken>(token)
  return {
    role,
    user_id,
    tenant_id,
    short_code,
  }
}

export const isTokenExpired = (token: string) => {
  if (!token) return true
  const { exp } = jwtDecode<{ exp: number }>(token)
  return Date.now() >= exp * 1000
}

export const isLoggedIn = async (request: Request) => {
  const session = await getSession(request)
  if (isTokenExpired(session.get('access_token'))) {
    await logout(request)
  }
}
