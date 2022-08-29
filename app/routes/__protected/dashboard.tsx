import { Outlet } from '@remix-run/react'

import type { LoaderArgs } from '~/remix.server'
import { getSession, logout } from '~/session.server'
import { isTokenExpired } from '~/utils/server/decodeToken.server'

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request)
  const accessToken = session.get('access_token')
  if (isTokenExpired(accessToken)) {
    return await logout(request)
  }

  return null
}

export default function Dashboard() {
  return <Outlet />
}
