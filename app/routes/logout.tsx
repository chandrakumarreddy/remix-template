import type { ActionFunction } from '~/remix.server'
import { logout } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
  await logout(request)
}

export const loader = () => {
  return null
}
